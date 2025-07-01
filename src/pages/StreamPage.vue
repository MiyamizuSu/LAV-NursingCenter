<template>
	<div class="container">
		<p style="font-size: 18px; font-weight: bold;">接入DeepSeek大模型，本地部署聊天界面</p>
		<div class="input-group">
			<el-input type="text" id="messageInput" placeholder="请输入问题..." v-model.trim="message" ref="myinput"
             style="width: 500px;" ></el-input>
			<el-button id="submitBtn" @click="mes">提交</el-button>
		</div>
		<div id="response" ref="responseDiv">
			{{content}}
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
	const responseDiv=ref(null);
	const myinput=ref(null);
	// 在文本框里要给AI发送的问题
	const  message=ref('');
	// AI回答的结果
	const content=ref('');
	// 点击提交按钮后调用的函数
	const mes=()=>{
		console.log(responseDiv.value);
		// EventSource 事件流
		// 用于接收服务器端发送的事件数据。
		// 当服务器端有新的事件数据可发送时，EventSource 会自动触发事件
		// 并将数据提供给前端处理。
		const eventSource = new EventSource(
			`http://localhost:9000/deepseek/chatStream?msg=${encodeURIComponent(message.value)}`);
		
		let currentLine = '';
		eventSource.onmessage = function(event) {
			const data = event.data;
			for (let char of data) {
				if (currentLine.length >= 30) {					
					content.value=currentLine + '\n';
					currentLine = '';
				}
				currentLine += char;
			}
			// 处理剩余字符
			if (data.length > 0 && currentLine.length > 0) {
				content.value += currentLine;
				currentLine = '';
			}
		};
		eventSource.onerror = function(error) {
			console.error('EventSource failed:', error);
			eventSource.close();
		};
		myinput.value.addEventListener('input', function() {
		 	eventSource.close();
		 });
	}
</script>

<style>
</style>
