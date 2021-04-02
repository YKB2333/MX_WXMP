<template>
  <view style="padding-bottom: 120rpx;">
    <view class="plr30">
      <!-- 输入框 -->
      <view class="ptb30 hairline-bottom">
        <textarea
          placeholder="商品怎么样，请写下详细的使用体验和分享理由吧！描述不能少于30字哦～"
          v-model="content"
          placeholder-class="color-gray"
          class="block mb20 w-full h160"
          :maxlength="200"
          @input="onInput"
        />
        <view class="color-gray fs-sm row flex-end">{{ inputLength }}/200</view>
      </view>
      <!-- 图片 -->
      <view class="ptb30 hairline-bottom">
        <view class="layout-row gutter-10">
          <view class="layout-col-8 relative" v-for="(url, index) in tempFilePaths" :key="index">
            <image :src="url" class="w-h214 radius mb10  " mode="aspectFill" />
            <image
              :src="IMAGE.ICON_DELETE"
              class="w-h28 absolute"
              style="right: -4rpx;top:-10rpx;"
              @click="onDeleteImg(index)"
            />
          </view>
          <!-- 选择 -->
          <view class="layout-col-8" v-if="tempFilePaths.length < 9">
            <image :src="IMAGE.CHOOSEIMG" class="w-h214 radius mb10" @click="onChooseImg" />
          </view>
        </view>
      </view>
      <!-- 选择关联商品 -->
      <view>
        <!-- 编辑状态下，不能选择商品 -->
        <navigator url="/pagesA/select/SelectGoods" v-if="!isEdit">
          <view class="row ptb30 center-y space-between mb20">
            <text class="fw600">关联商品</text>
            <view class="row center-y">
              <text class="color-gray fs-sm pr20" v-if="!goods">也许我能推荐个好东西？</text>
              <image :src="IMAGE.ARROW_RIGHT" class="w14 h24" style="position: relative;top:4rpx;" />
            </view>
          </view>
        </navigator>
        <!-- 商品 -->
        <view class="relative">
          <!-- 非编辑状态下 -->
          <block v-if="!isEdit && goods">
            <goods-box
              :image="goods.skuImages | formatSkuImg(goods.attrValueId)"
              :name="goods.spuName"
              :price="goods.salesPrice"
            />
            <!-- 删除icon -->
            <image
              :src="IMAGE.ICON_DELETE"
              class="w-h28 absolute"
              style="right: -10rpx;top:-10rpx;"
              @click="onDeleteGoods"
            />
          </block>
          <!-- 编辑状态下，不显示删除icon -->
          <goods-box
            v-if="isEdit && editData"
            :image="editData.spuImg"
            :name="editData.spuName"
            :price="editData.spuPrice"
          />
        </view>
      </view>
    </view>
    <button
      class="mt40 w-full h100 l-h100 bg-theme fixed fw600"
      style="bottom: 0;"
      :disabled="disabled"
      @tap="onPublish"
    >发布</button>
  </view>
</template>

<script>
import GoodsBox from "_c/GoodsBox";
import { ICON_DELETE, ARROW_RIGHT, CHOOSEIMG } from "@/imageConfig";
import { publishMaterial } from "@/api/goods/material";
import { getBatchSku } from "@/api/goods/sku";
import { uploadFile } from "@/api/tools/oss";

export default {
  name: "Material",
  components: { GoodsBox },
  data() {
    return {
      IMAGE: {
        ICON_DELETE,
        ARROW_RIGHT,
        CHOOSEIMG
      },
      inputLength: 0,
      tempFilePaths: [], // 本地临时图片路径
      content: "", // 素材内容
      spuId: "", // 商品spuId
      goods: null, // 选择的商品
      isEdit: false, // 是否编辑状态
      editData: null, //
      skuId: "" // 商品素材的界面传入的skuId参数
    };
  },
  computed: {
    disabled() {
      if (
        this.content &&
        this.inputLength >= 30 &&
        this.spuId &&
        this.tempFilePaths.length > 0
      ) {
        return false;
      }
      return true;
    }
  },
  onLoad(options) {
    if (options.data) {
      let json = JSON.parse(options.data);
      console.log(json);
      this.isEdit = true;
      this.content = json.content;
      this.inputLength = this.content.length;
      this.spuId = json.spuId;
      this.tempFilePaths = json.images.split(",");
      console.log(this.tempFilePaths);
      this.editData = json;
    }
    if (options.skuId) {
      // 如果从商品素材界面传入skuId,通过skuId获取商品数据
      this.skuId = options.skuId;
      getBatchSku([this.skuId]).then(res => {
        console.log(res.data);
        if (res.data.length) {
          this.goods = res.data[0];
          this.spuId = res.data[0].spuId;
        }
      });
    }
    this.$eventHub.$off(this.$eventName.SELECT_GOODS_SUCCESS);
    this.$eventHub.$on(this.$eventName.SELECT_GOODS_SUCCESS, goods => {
      console.log("监听选择商品", goods);
      this.spuId = goods.spuId;
      this.goods = goods;
    });
  },
  methods: {
    onInput(e) {
      // console.log(e)
      this.inputLength = e.detail.value.length;
    },
    // 调用微信API选择图片
    onChooseImg() {
      uni.chooseImage({
        count: 9 - this.tempFilePaths.length,
        success: res => {
          // tempFilePath可以作为image标签的src属性显示图片
          // console.log(res.tempFiles)
          console.log(res.tempFilePaths);
          this.tempFilePaths = this.tempFilePaths.concat(res.tempFilePaths);
        }
      });
    },
    // 删除商品
    onDeleteGoods() {
      console.log("删除商品");
      this.goods = null;
      this.spuId = "";
    },
    // 删除图片
    onDeleteImg(index) {
      console.log(index);
      this.tempFilePaths.splice(index, 1);
    },
    onPublish() {
      uni.showLoading({ mask: true });
      this.uplodaImages()
        .then(urls => {
          if (urls.length) {
            let images = urls.join(","); // 素材图片,逗号分隔
            let params = {
              content: this.content,
              // "coverHeight": 0,
              // "coverWidth": 0,
              images: images,
              spuId: this.spuId,
              type: 0
            };
            if (this.isEdit) {
              params.id = this.editData.id;
            }
            publishMaterial(params)
              .then(res => {
                this.$eventHub.$emit(this.$eventName.PUBLISH_MATERIAL_SUCCESS);
                uni.showToast({ title: "发布成功！", icon: "none" });
                uni.navigateBack();
              })
              .finally(() => {
                uni.hideLoading();
              });
          } else {
            uni.showToast({ title: "上传图片失败，请重试", icon: "none" });
          }
        })
        .catch(() => {
          uni.hideLoading();
        });
    },
    uplodaImages() {
      return new Promise(async (resolve, reject) => {
        try {
          let results = [];
          let temps = [];
          if (this.isEdit) {
            // 重新编辑状态下，只上传微信临时文件
            this.tempFilePaths.forEach(url => {
              // 开发工具为http://tmp开头，真机上为wxfile://开头
              if (url.startsWith("http://tmp") || url.startsWith("wxfile://")) {
                temps.push(url);
              } else {
                results.push(url);
              }
            });
          } else {
            temps = this.tempFilePaths;
          }
          for (let path of temps) {
            let image = await uploadFile("mp-material-images", path);
            results.push(image.url);
          }
          resolve(results);
        } catch (error) {
          resolve([]);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>