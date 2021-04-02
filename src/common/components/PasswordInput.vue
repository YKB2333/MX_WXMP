  
<!-- 
自定义验证码输入、密码输入使用
 
使用方法：
maxlength：输入最大长度
isPwd：是否是密码模式
@finish：回调函数
 <validcode :maxlength="4" :isPwd="false" @finish="finish"></validcode>
 -->
<template>
	<view class="code-area">
		<view :class="['flex-box',boxClass]">
			
			<input
				:value="val"
				type="number"
				:focus="isFocus"
				:maxlength="maxlength"
				class="hide-input"
				@input="getVal"
				:cursor-spacing="200"
			/>
			<view v-bind:class="['item', { active: codeIndex == 1 },itemClass]">
				<view class="line"></view>
				<block v-if="isPwd && codeArr.length >= 1">
					<text class="dot">·</text>
				</block>
				<block v-else>	{{ codeArr[0] ? codeArr[0] : ''}}</block>
			</view>
			<view v-bind:class="['item', { active: codeIndex == 2 },itemClass]">
				<view class="line"></view>
				<block v-if="isPwd && codeArr.length >= 2">
					<text class="dot">·</text>
				</block>
				<block v-else>	{{ codeArr[1] ? codeArr[1] : ''}}</block>
			</view>
			<view v-bind:class="['item', { active: codeIndex == 3 },itemClass]">
				<view class="line"></view>
				<block v-if="isPwd && codeArr.length >= 3">
					<text class="dot">·</text>
				</block>
				<block v-else>	{{ codeArr[2] ? codeArr[2] : ''}}</block>
			</view>
			<view v-bind:class="['item', { active: codeIndex == 4 },itemClass]">
				<view class="line"></view>
				<block v-if="isPwd && codeArr.length >= 4">
					<text class="dot">·</text>
				</block>
				<block v-else>	{{ codeArr[3] ? codeArr[3] : ''}}</block>
			</view>
			<block v-if="maxlength === 6">				
				<view v-bind:class="['item', { active: codeIndex == 5 },itemClass]">
					<view class="line"></view>
					<block v-if="isPwd && codeArr.length >= 5">
						<text class="dot">·</text>
					</block>
					<block v-else>	{{ codeArr[4] ? codeArr[4] : ''}}</block>
				</view>
				<view v-bind:class="['item', { active: codeIndex == 6 },itemClass]">
					<view class="line"></view>
					<block v-if="isPwd && codeArr.length >= 6">
						<text class="dot">·</text>
					</block>
					<block v-else>	{{ codeArr[5] ? codeArr[5] : ''}}</block>
				</view>
			</block>
			
			
		</view>
	</view>
</template>

<script>
export default {
	props: {
		//最大长度 值为4或者6
		maxlength: {
			type: Number,
			default: 4
		},
		//是否是密码
		isPwd: {
			type: Boolean,
			default: true
		},
		itemClass:{
			type:String,
			default:''
		},
		boxClass:{
			type:String,
			default:''
		}
	},
	data() {
		return {
			codeIndex: 1, //下标
			codeArr: [],
			val:'',//输入框的值
			isFocus:true,// 是否聚焦
		};
	},
	methods: {
		//取值
		getVal(e) {
			let { value } = e.detail;
			this.val=value;
			// console.log('验证码:', value);
			let arr = value.split('');
			this.codeIndex = arr.length + 1;
			this.codeArr = arr;
			// console.log(this.codeIndex, this.pwdArr);
			if (this.codeIndex > Number(this.maxlength)) {
				//输入完成
				this.$emit('finish',this.codeArr.join(''));
			}
		},
		//清除验证码或者密码
		clear(){
			this.codeIndex=1;
			this.codeArr=[];
			this.val="";
		}
	}
};
</script>

<style lang="scss">
.code-area {
	
	background: white;
	text-align: center;
	.flex-box {
		border-radius:8rpx;
		border: 2rpx solid #333333;
		box-sizing: border-box;
		width: 604rpx;
		margin: 0 auto;
		display: flex;
		// flex-wrap: wrap;
		position: relative;
		justify-content: center;
		overflow: hidden;
	}
	.item {
		border-radius:8r1px;
		position: relative;
		width: 100rpx;
		height: 100rpx;
		// margin-right: 18rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		line-height: 100rpx;
		box-sizing: border-box;
		border: 2rpx solid #F4F5F7;
	}
	.item:last-child {
		margin-right: 0;
	}
	.active {
		border-color: #333333;
	}
	.active .line {
		display: block;
	}
	.line {
		display: none;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 2rpx;
		height: 40rpx;
		background: #333333;
		animation: twinkling 1s infinite ease;
	}
	.hide-input {
		position: absolute;
		top: 0;
		left: -100%;
		width: 200%;
		height: 100%;
		text-align: left;
		z-index: 9;
		opacity: 1;
	}
	@keyframes twinkling {
		0% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 0.2;
		}
	}
	
	.dot{
		text-align: center;
		font-weight: 700;
		font-size: 30px;
		// line-height: 40rpx;
	}
}
</style>