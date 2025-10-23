<template>
  <section class="home-box">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="left-panel">
        <Logo />
        <div class="panel-section">
          <h4>1.添加主体</h4>
          <div class="card-item">
            <div class="card-header">
              <span class="card-font" style="white-space: nowrap;">主体视角</span>
              <el-input size="small" v-model="subjectView" >
                <template #append>
                  <a href="javascript:;" @click="handleAddSubject">添加</a>
                </template>
              </el-input>
            </div>
            <div
              class="card-content"
              :style="fileList.length ? { height: '100%', padding: '12px' } : { height: '100%', padding: '0' }">
              <el-upload
                v-model:file-list="fileList"
                :http-request="handleUpload"
                :list-type="fileList.length ? 'picture-card' : 'list-type'"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :limit="6"
              >
                <i-ep-plus v-if="fileList.length" />
                <el-button v-else type="primary"><i-ep-plus style="font-size: 11px;font-weight: bolder;" />批量上传图片</el-button>
              </el-upload>
            </div>
          </div>
        </div>
        <!-- <div class="panel-section">
          <h4>图片数量</h4>
          <el-radio-group v-model="imageCount" size="small">
            <el-radio-button
              v-for="item in imageCountEnum"
              :key="item.label"
              :value="item.label"
            >{{ item.value }}</el-radio-button>
          </el-radio-group>
        </div> -->
        <div class="panel-section" style="margin-top: 20px;">
          <h4>2.场景设置</h4>
          <el-radio-group v-model="designCategory">
            <el-radio-button :value="DesignCategoryEnum.recommend">推荐</el-radio-button>
            <el-radio-button :value="DesignCategoryEnum.space">空间定义</el-radio-button>
            <el-radio-button :value="DesignCategoryEnum.custom">补充描述</el-radio-button>
          </el-radio-group>
          <div class="scen-box" v-if="designCategory === DesignCategoryEnum.recommend">
            <span class="scen-box-title">场景风格</span>
            <div class="scen-box-content">
              <div class="scene-style-item-box" v-for="item in designStyleEnum" :key="item.label" @click="onDesignStyleClick(item)">
                <img class="scene-style-item-img" :src="item.url" :class="{'scene-style-item-img-seleted': item.value === designStyle}" />
                <span class="scene-style-item-text">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <div class="scen-box" v-else-if="designCategory === DesignCategoryEnum.space">
            <span class="scen-box-title">空间定义</span>
            <div class="space-buttons">
              <el-button
                :type="spaceDefinition === item.label ? 'primary' : 'default'"
                style="width: 66px;"
                v-for="item in spaceDefinitionEnum"
                :key="item.label"
                @click="onSpaceDefinitionClick(item.label)"
              >{{ item.label }}</el-button>
            </div>
            <span class="scen-box-title">空间尺寸</span>
            <div class="number-container">
              <el-input-number class="number-box" v-model="space.long" controls-position="right" placeholder="长(m)"></el-input-number>*
              <el-input-number class="number-box" v-model="space.width" controls-position="right" placeholder="宽(m)"></el-input-number>*
              <el-input-number class="number-box" v-model="space.height" controls-position="right" placeholder="高(m)"></el-input-number>
            </div>
            <span class="scen-box-title">家具搭配</span>
            <div class="space-buttons">
              <el-button
                :type="pType === item.value ? 'primary' : 'default'"
                style="width: 66px;"
                v-for="item in productTypeEnum"
                :key="item.value"
                @click="onPTypeClick(item.value)"
              >{{ item.value }}</el-button>
            </div>
          </div>
          <div class="scen-box" v-else>
            <span class="scen-box-title">场景描述</span>
            <el-input v-model="specialDesc" type="textarea" :rows="10" placeholder="请补充场景要求，例如输入：【墙体颜色，房间尺寸，场景元素】" />
          </div>
        </div>

        <div class="panel-section" style="margin-top: 20px;">
          <h4>3.空间色系</h4>
          <el-color-picker v-model="themeColor" />
        </div>
      </div>
      <!-- 中央3D视图区域 -->
      <div class="center-view dynamic-image">
        <div class="model-view">
          <!-- 这里放置3D模型视图 -->
        </div>
        <img class="loading-image" v-if="loading" src="./images/loading.svg" alt="">
        <template v-if="genImge">
          <img style="width: 90%;" :src="genImge" @click="showGenImage" />
        </template>
        <template v-else>
          <img class="model-image-preview" src="./images/gen.png" alt="3D模型视图" />
          <div class="inspiration-library">
            <img v-for="i in selectedInspiration" :key="i" class="inspiration-item" :src="i" @dblclick="handleInspirationClick({url: i})" />
          </div>
        </template>
      </div>

      <!-- 右侧结构设置面板 -->
      <div class="right-panel">
        <div class="panel-section">
          <h4>4.成品搭配</h4>
          <div class="inspiration-library">
            <img
              v-for="i in mockList"
              :key="i.name"
              class="inspiration-item"
              :src="i.url"
              :class="{'inspiration-item-seleted': selectedInspiration.includes(i.url)}"
              @click="() => handleInspirationClick(i)"
            />
          </div>
        </div>
        <div class="primary-btn" :class="{'boder-beautiful': loading}" :style="{padding: '2px', borderRadius: '4px'}">
          <el-button style="width: 100%;" type="primary" @click="handleGenerateClick">开始生成</el-button>
        </div>
      </div>
    </div>
    <div ref="imageBoxRef">
      <img v-for="item in showFileList" :key="item.name" style="display: none;" :src="item.url" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import Logo from './logo.vue'
import {
  spaceDefinitionEnum,
  designStyleEnum,
  imageCountEnum,
  DesignCategoryEnum,
  productTypeEnum,
  XD_CJ,
  ZS_CJ,
  XD_SF,
  ZS_SF,
} from './enums.js'
// 响应式数据
const spaceDefinition = ref('livingroom')
const activeTab = ref('basic')
const imageCount = ref(2)
const designCategory = ref(DesignCategoryEnum.recommend);
const designStyle = ref(designStyleEnum[0].value);
const specialDesc = ref('')
const viewAngle = ref('camera')
const zoom = ref(100)
const wallHeight = ref(100)
const displayOption = ref('all')
import bai from './images/G520-A-白底图-沙发-沼泽黑.jpg';
import huxing from './images/户型图.png'
import gen from './images/生成图.png'
import axios from "axios";

const sessionkey = localStorage.getItem('sessionkey') || '918C18C0185F4D67893DA9F37C5D9A57'

// 处理添加主体
const handleAddSubject = () => {
  if(subjectView.value) {
    fileList.value.push({
      name: '主体视角',
      url: subjectView.value,
    })
  }
}

// 加载状态
const loading = ref(false)
const genImge = ref(null)
const taskId = ref('4836468373445143450')
// 查询任务状态
const queryTaskStatus = async () => {
  if(!taskId.value) {
    loading.value = false;
    return;
  };
  loading.value = true;
  let passIs = false;
  axios.get(`/aiApi/plm-matrix/Ai/Jm/query/${taskId.value}`,{
    headers: {
      sessionkey,
    }
  }).then((res) => {
    if(res.data.state === 100 && res.data.data) {
      genImge.value = res.data.data;
      passIs = true;
    }
  }).catch((error) => {
    console.log(error);
  }).finally(() => {
    console.log(passIs)
    if(passIs) {
      loading.value = false;
    }else {
      setTimeout(() => {
        queryTaskStatus();
      }, 6000);
    }
  });
}
// 处理生成点击
const handleGenerateClick = async () => {
  if(loading.value) return;
  genImge.value = null;
  loading.value = true
  // 模拟生成过程
  await axios.post('/aiApi/plm-matrix/Ai/Jm/generate-from-image', {
    "cfgScale": 7.5,
    "height": 1024,
    "image_urls": [
      ...fileList.value.map(item => item.url),
      ...selectedInspiration.value,
      ...(subjectView.value ? [subjectView.value] : []),
    ],
    "kongJian": spaceDefinition.value,
    "model": "jimeng-v1.0",
    "negativePrompt": "string",
    "prompt": (specialDesc.value || '生成空间全景图') + (themeColor.value ? ',空间色系:' + themeColor.value : ''),
    "referenceStrength": 0.5,
    "samples": 1,
    "seed": 123456,
    "steps": 20,
    "styleType": designStyle.value,
    "width": 1024
  },{
    headers: {
      sessionkey,
    }
  }).then((res) => {
    console.log(res)
    if(res.data.state === 100) {
      const data = JSON.parse(res.data.data)
      taskId.value = data?.data?.task_id;
      queryTaskStatus();
    }
    
  }).catch((error) => {
    console.log(error);
  });
}

// 空间尺寸
const space = ref({
  long: null,
  width: null,
  height: null,
})

// 处理场景风格点击
const onDesignStyleClick = (item) => {
  designStyle.value = item.value;
  renderInspirationLibrary();
}

// 空间色系
const themeColor = ref();



const imageContainer = ref(null)
const imageBoxRef = ref(null)
let viewer = null
const initializeViewer = () => {
  viewer = new Viewer(imageBoxRef.value, {
    navbar: true,
    title: true,
  });
}


onMounted(() => {
  initializeViewer()
})

// 处理空间定义点击
const mockList = ref([...ZS_CJ, ...XD_CJ, ...ZS_SF, ...XD_SF])
const renderInspirationLibrary = () => {
  // if(pType.value === '茶几' && designStyle.value === '中国风') {
  //   mockList.value = ZS_CJ
  // } else if(pType.value === '茶几' && designStyle.value === '现代') { 
  //   mockList.value = XD_CJ
  // } else if(pType.value === '沙发' && designStyle.value === '现代') {
  //   mockList.value = XD_SF
  // } else if(pType.value === '沙发' && designStyle.value === '中国风') {
  //   mockList.value = ZS_SF
  // }
}
const onSpaceDefinitionClick = (label) => {
  spaceDefinition.value = label;
  renderInspirationLibrary()
}
// 处理标签页切换
const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.name)
}

const subjectView = ref('')
const showFileList = ref([])
const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://gyl-lsprtgallery-sit.oss-cn-shenzhen.aliyuncs.com/gylFilesTest/20251022/176110553562419949_客厅.png',
  },
])

// 产品类型
const pType = ref('')
const onPTypeClick = (value) => {
  pType.value = value;
  renderInspirationLibrary()
}


// 上传图片
function handleUpload(options) {
  console.log(options)
}
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

// 查看生成图大图
function showGenImage() {
  if (!genImge.value) return; // 确保有图片再显示
  showFileList.value = [{url: genImge.value, name: '生成图'}];
  
  // 销毁旧的viewer实例
  if (viewer) {
    viewer.destroy();
  }
  
  // 等待DOM更新后重新初始化viewer
  setTimeout(() => {
    viewer = new Viewer(imageBoxRef.value, {
      navbar: true,
      title: true,
    });
    viewer.show();
  }, 0);
}
// 查看主体视角图片
const handlePictureCardPreview = (uploadFile) => {
  const index = fileList.value.findIndex(item => item.uid === uploadFile.uid)
  console.log(index)
  if (fileList.value.length === 0) return; // 确保有图片再显示
  showFileList.value = [...fileList.value]; // 创建新数组触发响应式更新
  
  // 销毁旧的viewer实例
  if (viewer) {
    viewer.destroy();
  }
  
  // 等待DOM更新后重新初始化viewer
  setTimeout(() => {
    viewer = new Viewer(imageBoxRef.value, {
      navbar: true,
      title: true,
    });
    viewer.view(index);
  }, 0);
}

const selectedInspiration = ref([])
// 处理成品搭配点击
const handleInspirationClick = (item) => {
  if(selectedInspiration.value.includes(item.url)){
    selectedInspiration.value = selectedInspiration.value.filter(i => i !== item.url)
    return
  }
  selectedInspiration.value = [...selectedInspiration.value, item.url]
}
</script>

<style lang="scss" scoped>
@property --border-gradient-angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}

.boder-beautiful {
  background-image: conic-gradient(from var(--border-gradient-angle) at 50% 50%, transparent, #70ffaf 14%, transparent 17%);
  border-radius: var(--outer-radius);
  background-size: contain;
  padding: var(--border-size);
  animation: buttonBorderSpin 4s linear infinite 0ms;
}
@keyframes buttonBorderSpin {
  0% {
    --border-gradient-angle: 0turn;
  }

  100% {
    --border-gradient-angle: 1turn;
  }
}

:deep(.el-button) {
  background-color: rgb(45 45 45);
}
:deep(.el-button--primary) {
  background-color: var(--el-color-primary);
}
:deep(.el-radio-group) {
  display: flex;
}
:deep(.el-radio-button) {
  flex: 1;
}
:deep(.el-radio-button__inner) {
  width: 100%;
}
:deep(.el-button+.el-button) {
  margin-left: 0px;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px;
}
:deep(.el-upload-list__item) {
  width: 80px;
  height: 80px;
}
.home-box{
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}


/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

/* 左侧控制面板 */
.left-panel {
  margin-top: 2px;
  background-color: #2e2e2e;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 55px);
  padding: 24px;
  position: relative;
  transition: all .5s;
  width: 316px;
  min-width: 316px;
  border: 1px solid var(--el-color-primary);
  border-radius: 8px;
  overflow-y: auto;
  .card-item {
    border-radius: 8px;
    margin-bottom: 12px;
    height: 190px;
    :deep(.el-icon.avatar-uploader-icon) {
      height: 90px;
      width: 90px;
    }
    :deep(.el-upload-list__item-status-label) {
      display: none;
    }
    :deep(.el-upload-list__item) {
      height: 88px;
      width: 88px;
    }
    :deep(.el-upload--picture-card) {
      height: 90px;
      width: 90px;
      background-color: #494949;
      border: 0;
    }
    .card-header {
      align-items: center;
      background-color: #515151;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      justify-content: space-between;
      padding: 12px;
    }
    .card-content {
      align-items: center;
      background-image: url(/src/assets/img-bg.png);
      background-repeat: repeat;
      background-size: 20px 20px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .normal-image {
      border: 2px solid rgb(30, 30, 30);
      border-radius: 8px;
      margin-bottom: 12px;
      margin-right: 2px;
      background-color: rgba(255, 255, 255, 0);
    }
    .image-box {
      align-items: center;
      border-radius: 8px;
      box-sizing: content-box;
      cursor: pointer;
      display: flex;
      height: 90px;
      justify-content: center;
      object-fit: cover;
      position: relative;
      width: 90px;
    }
  }
  .card-font {
    font-size: 12px;
    font-weight: 400;
    line-height: normal;
    margin-right: 2px;
  }
  .scen-box {
    border: 1px solid transparent;
    border-radius: 8px;
    background-color: #464646;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 12px;
    padding-left: 10px;
    margin-top: 8px;
    flex-direction: column;
    :deep(.el-textarea__inner) {
      border: none;
      resize: none;
      box-shadow: unset;
      padding: 0;
      font-size: 12px;
      padding-right: 8px;
    }
    .scen-box-title {
      font-size: 12px;
      font-weight: 400;
      line-height: normal;
      margin-right: 2px;
      padding: 12px 0;
    }
  }
  .scen-box-content {
    display: flex;
    flex-wrap: wrap;
    height: 180px;
  }
  .scene-style-item-box {
    margin-right: 1px;
    cursor: pointer;
    .scene-style-item-img {
      align-items: center;
      border: 2px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      height: 66px;
      justify-content: center;
      position: relative;
      width: 66px;
    }
    .scene-style-item-text {
      align-items: center;
      border: 4px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      position: relative;
    }
  }
  .scene-style-item-img:hover {
    transform: scale(1.1);
    transition: transform 0.5s ease;
  }
  .scene-style-item-img-seleted {
    border-color: #00ff0dc4 !important;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .panel-section {
    margin-bottom: 25px;
    h4 {
      margin-bottom: 10px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }

    .composition-buttons {
      margin-bottom: 10px;
    }

    .quality-control {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    .space-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .number-container {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .upload-btn {
      width: 100%;
      margin-top: 10px;
    }
  }
  .primary-btn {
    width: calc(100% - 60px);
    position: absolute;
    bottom: 30px;
    :deep(.el-button--primary) {
      background-color: #646cff;
    }
  }
}

/* 中央3D视图区域 */
.center-view {
  flex: 1;
  padding: 0 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0);
  flex-direction: column;
  position: relative;
  .loading-image {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9;
    animation: unset;
  }
  .model-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .model-image-preview {
    margin-bottom: 32px;
    height: 56vh;
  }
  .inspiration-library {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    .inspiration-item {
      align-items: center;
      background-color: #171717;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      height: 110px;
      justify-content: center;
      width: 110px;
    }
    .inspiration-item:hover {
      transform: scale(1.03);
      transition: transform 0.5s ease;
    }
    .inspiration-item-seleted {
      border-color: #21c4ecc4 !important;
    }
  }
}

/* 右侧结构设置面板 */
.right-panel {
  width: 270px;
  min-width: 270px;
  height: 100vh;
  background-color: #2e2e2e;
  padding: 8px;
  overflow-y: auto;
  border-left: 1px solid #444;
  position: relative;
  .primary-btn {
    width: calc(100% - 16px);
    position: absolute;
    bottom: 30px;
    :deep(.el-button--primary) {
      background-color: #646cff;
    }
  }
  .panel-section {
    margin-bottom: 25px;
    h4 {
      margin-bottom: 10px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .inspiration-library {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 87vh;
    overflow-y: auto;
    .inspiration-item {
      align-items: center;
      background-color: #171717;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      height: 110px;
      justify-content: center;
      width: 110px;
      border: 2px solid transparent;
    }
    .inspiration-item:hover {
      transition: transform 0.5s ease;
    }
    .inspiration-item-seleted {
      border-color: #00ff0dc4 !important;
    }
  }
}
.w-100 {
  width: 100%;
}
.number-box {
  width: 90px;
  background: #2e2e2e;
  border-radius: 4px;
}

/* 定义floatup动画，使元素向上浮动并逐渐消失 */
@keyframes floatup {
  from {
    transform: translate(-50%, -50%) scale(1); /* 初始状态 */
    opacity: 1;
  }
  to {
    transform: translate(-50%, -150%) scale(2); /* 终止状态，将元素放大2倍，并向上移动50% */
    opacity: 0;
  }
}

/* 定义size-up动画，使元素从初始状态缩放到35倍大小 */
@keyframes size-up {
  from {
    transform: scale(0.1); /* 初始状态，将元素缩小10倍 */
  }
  to {
    transform: scale(1); /* 终止状态，将元素放大35倍 */
  }
}

/* 将size-up动画添加到img元素中，使图片缩放到35倍大小 */
.dynamic-image {
  img {
    animation: size-up 1s ease-out forwards; /* 动画持续时间为6秒，并在动画结束后保持最终状态 */
  }
}
:deep(button:focus-visible) {
  outline: none !important;
}
:deep(.el-color-picker__color-inner) {
  width: 100%;
  i{
    display: none;
  }
}
:deep(.el-color-picker) {
  width: 100%;
}
</style>
