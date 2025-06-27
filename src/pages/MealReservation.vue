<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage, ElTabs, ElTabPane } from 'element-plus'

// 膳食项接口
interface MealItem {
  id: number
  foodId: number
  foodName: string
  foodType: '早餐' | '午餐' | '晚餐' | '甜点'
  foodDescription: string
  foodPrice: number
  foodImageUrl: string
  quantity: number
}

interface OrderItem {
  deleted: unknown
  id: number
  mealItemId: number
  purchaseCount: number
  purchaseTime: string
  isDeleted: boolean
  mealItemDetail?: MealItem
}

// 购物车项接口
interface CartItem {
  mealItemId: number
  purchaseCount: number
}

interface OrderGroup {
  items: OrderItem[]
  total: number
}

const activeTab = ref('reservation')
const orderData = ref<Record<string, OrderGroup>>({})

const mealData = ref<Record<string, MealItem[]>>({})
const cart = ref<CartItem[]>([])
const activeType = ref('早餐')
const isCartExpanded = ref(false)

const detailVisible = ref(false)
const selectedMeal = ref<MealItem | null>(null)

const activeKey = ref<string[]>([])

const showDetail = (meal: MealItem) => {
  selectedMeal.value = meal
  detailVisible.value = true
}

const totalPrice = computed(() => {
  return filteredCart.value.reduce((sum, item) => sum +
    (getMealItemById(item.mealItemId)?.foodPrice || 0) * item.purchaseCount, 0)
})

// 获取膳食数据
onMounted(async () => {
  try {
    const weekDayNumber = new Date().getDay()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekDays[weekDayNumber]
    const { data: pr } = await axios.post('http://localhost:9000/mealItem/listByWeekday', { weekday })
    if (pr.status === 200) {
      mealData.value = pr.data.reduce((acc: Record<string, MealItem[]>, item: MealItem) => {
        if (!acc[item.foodType]) acc[item.foodType] = []
        acc[item.foodType].push({ ...item, quantity: 0 })
        return acc
      }, {})
    } else {
      ElMessage.error(pr.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('网络请求异常')

  }
})
// 滚动方法
const scrollToType = (type: string) => {
  activeType.value = type
  nextTick(() => {
    const target = document.getElementById(type)
    const container = document.querySelector('.content-area')
    if (target && container) {
      // 计算相对容器的位置
      const targetTop = target.offsetTop - container.clientHeight * 0.2
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      })
    }
  })
}

// 数量操作
const updateQuantity = (item: MealItem, delta: number) => {
  item.quantity = Math.max((item.quantity || 0) + delta, 0)

  const index = cart.value.findIndex(c => c.mealItemId === item.id)
  if (item.quantity > 0) {
    if (index > -1) {
      cart.value[index].purchaseCount = item.quantity
    } else {
      cart.value.push({ mealItemId: item.id, purchaseCount: item.quantity })
    }
  } else if (index > -1) {
    cart.value.splice(index, 1)
  }
}

const getMealItemById = (id: number) => {
  return Object.values(mealData.value)
    .flat()
    .find(item => item.id === id)
}

// 提交订单
const submitOrder = async () => {
  if (cart.value.length === 0) {
    ElMessage.warning('请先选择菜品')
    return
  }

  try {
    await axios.post('http://localhost:9000/mealReservation/add', {
      mealItemIds: cart.value.map(c => c.mealItemId),
      purchaseCounts: cart.value.map(c => c.purchaseCount),
      purchaseTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      customerId: 1
    })
    ElMessage.success('预定成功')
    cart.value = []
    Object.values(mealData.value).forEach(items => {
      items.forEach(item => item.quantity = 0)
    })
  } catch (error) {
    ElMessage.error('预定失败')
  }
}

// 获取订单数据
const fetchOrders = async () => {
  try {
    const { data } = await axios.post('http://localhost:9000/mealReservation/getByCustomerId', {
      customerId: 1
    })
    if (data.status === 200) {
      const ordersWithDetails = await Promise.all(
        data.data.map(async (order: OrderItem) => {
          const { data: itemData } = await axios.post('http://localhost:9000/mealItem/getById', {
            id: order.mealItemId
          })
          return { ...order, mealItemDetail: itemData.data }
        })
      )

      // 按精确时间分组并计算总价
      orderData.value = ordersWithDetails.reduce((acc: Record<string, {
        items: OrderItem[]
        total: number
      }>, item: OrderItem) => {
        const datetime = new Date(item.purchaseTime).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        if (!acc[datetime]) {
          acc[datetime] = {
            items: [],
            total: 0
          }
        }
        acc[datetime].items.push(item)
        acc[datetime].total += (item.mealItemDetail?.foodPrice || 0) * item.purchaseCount
        return acc
      }, {})
    }
  } catch (error) {
    ElMessage.error('获取订单失败')
  }
}

// 过滤购物车显示
const filteredCart = computed(() =>
  cart.value.filter(item => item.purchaseCount > 0)
)
</script>

<template>
  <div class="container">
    <!-- 顶部导航 -->
    <el-tabs v-model="activeTab" @tab-change="tab => tab === 'orders' && fetchOrders()">
      <el-tab-pane label="膳食预订" name="reservation" />
      <el-tab-pane label="我的订单" name="orders" />
    </el-tabs>

    <!-- 膳食预订页内容 -->
    <div v-if="activeTab === 'reservation'" class="main-content">
      <!-- 左侧导航 -->
      <div class="type-nav">
        <div v-for="type in Object.keys(mealData)" :key="type" :class="['nav-item', { active: activeType === type }]"
          @click="scrollToType(type)">
          {{ type }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <div v-for="(items, type) in mealData" :key="type" :id="type">
          <h3 class="type-title">{{ type }}</h3>
          <div class="meal-item" v-for="item in items" :key="item.id" @click="showDetail(item)">
            <img :src="item.foodImageUrl" class="meal-image">
            <div class="meal-info">
              <h4>{{ item.foodName }}</h4>
              <div class="price">¥{{ item.foodPrice }}</div>
            </div>
            <div class="quantity-control">
              <button v-if="item.quantity > 0" @click.stop="updateQuantity(item, -1)" class="btn minus"></button>
              <span v-if="item.quantity > 0" class="count">{{ item.quantity }}</span>
              <button @click.stop="updateQuantity(item, 1)"
                :class="['btn plus', { 'active': item.quantity > 0 }]"></button>
            </div>
          </div>
        </div>
      </div>

      <!-- 详情弹窗 -->
      <el-dialog v-model="detailVisible" title="膳食详情" width="500px">
        <div v-if="selectedMeal" class="meal-detail">
          <img :src="selectedMeal.foodImageUrl" class="detail-image">
          <div class="detail-info">
            <h3>{{ selectedMeal.foodName }}</h3>
            <p class="description">{{ selectedMeal.foodDescription }}</p>
            <div class="price">¥{{ selectedMeal.foodPrice }}</div>
          </div>
        </div>
      </el-dialog>

      <!-- 购物车 -->
      <div v-if="filteredCart.length > 0" class="cart-footer" @click.self="isCartExpanded = !isCartExpanded">
        <div class="cart-header">
          <div class="cart-total">
            <span>总计：¥{{ totalPrice }}</span>
            <el-icon :class="['arrow', { expanded: isCartExpanded }]">
              <ArrowDown />
            </el-icon>
          </div>
          <button class="confirm-btn" @click="submitOrder">确认订单</button>
        </div>

        <transition name="slide">
          <div v-show="isCartExpanded" class="cart-items">
            <div v-for="cartItem in filteredCart" :key="cartItem.mealItemId" class="cart-item">
              <img :src="getMealItemById(cartItem.mealItemId)?.foodImageUrl" class="cart-image">
              <div class="item-info">
                <div class="name">{{ getMealItemById(cartItem.mealItemId)?.foodName }}</div>
                <div class="price">¥{{ getMealItemById(cartItem.mealItemId)?.foodPrice }} x {{ cartItem.purchaseCount }}
                </div>
              </div>
              <div class="quantity-control">
                <button @click.stop="updateQuantity(getMealItemById(cartItem.mealItemId)!, -1)">-</button>
                <button @click.stop="updateQuantity(getMealItemById(cartItem.mealItemId)!, 1)">+</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 订单页内容 -->
    <div v-if="activeTab === 'orders'" class="order-content">
      <el-collapse v-model="activeKey">
        <el-collapse-item v-for="(group, datetime) in orderData" :key="datetime" :name="datetime">
          <template #title>
            <div class="collapse-header">
              <span class="datetime">{{ datetime }}</span>
              <span class="preview-total">总价：¥{{ group.total }}</span>
              <div class="status-container">
                <span class="status-tag" :class="{
                  completed: group.items.every(i => i.deleted),
                  pending: !group.items.every(i => i.deleted)
                }" style="font-size: 12px; padding: 2px 6px">
                  {{group.items.every(i => i.deleted) ? '已完成' : '未完成'}}
                </span>
              </div>
            </div>
          </template>

          <div v-for="order in group.items" :key="order.id" class="order-item">
            <img :src="order.mealItemDetail?.foodImageUrl" class="meal-image">
            <div class="order-info">
              <div class="name">{{ order.mealItemDetail?.foodName }}</div>
              <div class="detail">
                <span class="quantity">x{{ order.purchaseCount }}</span>
                <span class="price">单价：¥{{ order.mealItemDetail?.foodPrice }}</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
}

:deep(.el-tabs) {
  flex-shrink: 0;
  background: #fff;
  padding: 0 20px;
}

.main-content {
  flex: 1;
  display: flex;
  height: calc(100vh - 50px);
}

.order-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}


.type-nav {
  width: 80px;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  flex-shrink: 0;
  padding: 10px 0;

  .nav-item {
    padding: 12px 8px;
    text-align: center;
    line-height: 1.4;
    font-size: 13px;
    color: #666;

    &.active {
      color: #07c160;
      background: #f0faf7;
      border-left: 3px solid #07c160;
      border-bottom: none;
    }
  }
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px 15px 80px;
}

.meal-item {
  display: flex;
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 8px;

  .meal-image {
    width: 80px;
    height: 80px;
    border-radius: 6px;
  }

  .meal-info {
    flex: 1;
    padding-left: 12px;

    h4 {
      font-size: 16px;
      margin-bottom: 6px;
    }

    .description {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }

    .price {
      color: #ff4444;
      font-size: 16px;
      margin-top: 8px;
    }
  }
}

:deep(.el-dialog) {
  width: 90%;
  max-width: 600px;

  .el-dialog__body {
    padding: 20px;
  }
}

.quantity-control {
  display: flex;
  align-items: center;

  .btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: #fff;

    &.active {
      border-color: #409EFF;
      color: #409EFF;
    }

    &.plus::after {
      content: '+';
    }

    &.minus::after {
      content: '-';
    }
  }

  .count {
    margin: 0 8px;
  }
}

.meal-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .detail-image {
    width: 100%;
    max-width: 300px;
    height: auto;
    aspect-ratio: 3/2;
    border-radius: 8px;
    margin: 0 auto;
  }

  .detail-info {
    h3 {
      font-size: 20px;
      margin-bottom: 8px;
    }

    .description {
      font-size: 14px;
      line-height: 1.6;
      color: #666;
      margin-bottom: 12px;
    }

    .price {
      color: #ff4444;
      font-size: 24px;
      font-weight: bold;
    }
  }
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 12px;
  padding: 12px 15px;
  background: #fff;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;


  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;

    .cart-total {
      display: flex;
      align-items: center;
      gap: 8px;

      .arrow {
        transition: transform 0.3s;

        &.expanded {
          transform: rotate(180deg);
        }
      }
    }
  }

  .cart-items {
    max-height: 50vh;
    overflow-y: auto;
    border-top: 1px solid #eee;
    padding-top: 10px;

    .cart-item {
      display: flex;
      align-items: center;
      padding: 8px;
      margin-bottom: 8px;
      background: #f8f8f8;
      border-radius: 6px;

      .cart-image {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        margin-right: 10px;
      }

      .item-info {
        flex: 1;

        .name {
          font-weight: 500;
        }

        .price {
          color: #666;
          font-size: 0.9em;
        }
      }

      .quantity-control {
        display: flex;
        gap: 6px;

        button {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: white;
        }
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.confirm-btn {
  background: var(--el-color-primary);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 30px;
  font-size: 12px;
  transition: all 0.3s;
  margin-left: auto;

  &:active {
    transform: scale(0.98);
  }
}

.order-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.order-group {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-date {
  padding: 12px;
  margin: 0;
  background: #f8f8f8;
  font-size: 14px;
  color: #666;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;

  .meal-image {
    width: 60sspx;
    height: 60px;
    border-radius: 4px;
    margin-right: 15px;
  }

  .order-info {
    flex: 1;

    .name {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .quantity {
      color: #666;
      font-size: 12px;
    }

    .price {
      color: #ff4444;
      font-weight: bold;
    }
  }
}

.collapse-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 20px;
  align-items: center;
  font-size: 12px;

  .datetime {
    font-weight: 500;
    color: #333;
  }

  .preview-total {
    color: #ff4444;
    font-weight: bold;
  }
}

.status-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  transform: scale(0.9);
  transform-origin: left center;
  line-height: 1.2;
  margin-left: 8px;

  &.completed {
    background: #e8f5e9;
    color: #07c160;
  }

  &.pending {
    background: #fff3e0;
    color: #ff9900;
  }
}
</style>