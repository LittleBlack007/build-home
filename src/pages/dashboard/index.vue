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
              <span class="card-font">主体视角</span>
            </div>
            <div
              class="card-content"
              :style="fileList.length ? { height: 'auto', padding: '12px' } : { height: '100%', padding: '0' }">
              <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :list-type="fileList.length ? 'picture-card' : 'list-type'"
                :on-preview="() => handlePictureCardPreview(fileList)"
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
            <el-radio-button :value="DesignCategoryEnum.custom">自定义</el-radio-button>
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
          <div class="scen-box" v-else>
            <span class="scen-box-title">场景描述</span>
            <el-input v-model="specialDesc" type="textarea" :rows="10" placeholder="请补充场景要求，例如输入：【墙体颜色，房间尺寸，场景元素】" />
          </div>
        </div>

        <!-- <div class="panel-section">
          <h4>空间定义</h4>
          <div class="space-buttons">
            <el-button
              :type="spaceDefinition === item.label ? 'primary' : 'default'"
              style="width: 66px;"
              v-for="item in spaceDefinitionEnum"
              :key="item.label"
              @click="onSpaceDefinitionClick(item.label)"
            >{{ item.value }}</el-button>
          </div>
        </div> -->
        <div class="primary-btn" :class="{'boder-beautiful': loading}" :style="{padding: '2px', borderRadius: '4px'}">
          <el-button style="width: 100%;" type="primary" @click="handleGenerateClick">开始生成</el-button>
        </div>
        
        <!-- <div class="panel-section">
          <h4>图片参考</h4>
          <el-upload
            v-model:file-list="fileList"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i-ep-plus />
          </el-upload>
        </div> -->
      </div>
      <!-- 中央3D视图区域 -->
      <div class="center-view">
        <div class="model-view">
          <!-- 这里放置3D模型视图 -->
        </div>
        <template v-if="genImge">
          <img class="model-image-preview" style="width: 100%; height: 100%;" :src="genImge" alt="3D模型视图" @click="() => handlePictureCardPreview([{url:genImge}])" />
        </template>
        <template v-else>
          <img class="model-image-preview" src="./images/gen.png" alt="3D模型视图" />
          <div class="inspiration-library">
            <img v-for="i in mockList" :key="i.label" class="inspiration-item" :src="i.url" />
          </div>
        </template>
      </div>

      <!-- 右侧结构设置面板 -->
      <!-- <div class="right-panel">
        <div class="panel-section">
          <h4>户型参考</h4>
          <div class="floorplan-reference">
            <div class="floorplan-preview">
              <div class="floorplan-item" id="viewerjs" ref="imageContainer">
                <img src="https://picsum.photos/id/1031/200/200" alt="户型图" class="floorplan-image" />
                <div class="room-labels"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="panel-section">
          <h4>空间尺寸</h4>
          <el-input-number class="w-100" v-model="space.long" controls-position="right" placeholder="长(m)"></el-input-number>
          <el-input-number class="w-100" v-model="space.width" controls-position="right" placeholder="宽(m)"></el-input-number>
          <el-input-number class="w-100" v-model="space.height" controls-position="right" placeholder="高(m)"></el-input-number>
        </div>
        <div class="primary-btn">
          <el-button type="primary" round style="width: 100%;">主要按钮</el-button>
        </div>
      </div> -->
    </div>
    <div ref="imageBoxRef">
      <img v-for="item in showFileList" :key="item.name" style="display: none;" :src="item.url" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import Logo from './logo.vue'
import {
  spaceDefinitionEnum,
  designStyleEnum,
  imageCountEnum,
  DesignCategoryEnum,
  mockList
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
import bai from './images/G520-A-白底图-沙发-奶酪白.jpg';
import huxing from './images/户型图.png'
import gen from './images/生成图.png'

// 加载状态
const loading = ref(false)
const genImge = ref(null)
// 处理生成点击
const handleGenerateClick = async () => {
  loading.value = true
  // 模拟生成过程
  await new Promise(resolve => setTimeout(resolve, 2000))
  genImge.value = gen;
  loading.value = false
}

// 空间尺寸
const space = ref({
  long: 0,
  width: 0,
  height: 0,
})

// 处理场景风格点击
const onDesignStyleClick = (item) => {
  designStyle.value = item.value;
}

const imageContainer = ref(null)
const imageBoxRef = ref(null)
let viewer = null
const initializeViewer = () => {
  viewer = new Viewer(imageBoxRef.value, {
    navbar: true,
    title: true,
    // toolbar: {
    //   prev: true,
    //   next: true,
    // },
  });
}

onMounted(() => {
  initializeViewer()
})

// 处理空间定义点击
const onSpaceDefinitionClick = (label) => {
  spaceDefinition.value = label
}
// 处理标签页切换
const handleTabClick = (tab) => {
  console.log('切换到标签页:', tab.name)
}

const showFileList = ref([])
const fileList = ref([
  {
    name: 'food.jpeg',
    url: bai,
  },
  {
    name: 'food.jpeg',
    url: huxing,
  },
])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (fileList) => {
  showFileList.value = fileList;
  
  setTimeout(() => {
    initializeViewer()
    // viewer.view(0);
    viewer.show()
  }, 30)
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
  border: 1px solid #5d5d5d;
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
      height: 90px;
      width: 90px;
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
      -o-object-fit: contain;
      object-fit: contain;
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
      border: 2px solid transparent;
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
    border-color: #007dffc4 !important;
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

    .upload-btn {
      width: 100%;
      margin-top: 10px;
    }
  }
  .primary-btn {
    width: calc(100% - 60px);
    position: absolute;
    bottom: 20px;
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
  
  .model-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .model-image-preview {
    margin-bottom: 32px;
    width: 56vh;
  }
  .inspiration-library {
    display: flex;
    justify-content: space-between;
    width: 56vh;
    .inspiration-item {
      align-items: center;
      background-color: #171717;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      height: 13vh;
      justify-content: center;
      width: 13vh;
    }
    .inspiration-item:hover {
      transform: scale(1.1);
      transition: transform 0.5s ease;
    }
    .inspiration-item-seleted {
      border-color: #007dffc4 !important;
    }
  }
}

/* 右侧结构设置面板 */
.right-panel {
  width: 250px;
  height: 100vh;
  background-color: #1e1e1e;
  padding: 8px;
  overflow-y: auto;
  border-left: 1px solid #444;
  position: relative;
  .primary-btn {
    width: calc(100% - 16px);
    position: absolute;
    bottom: 20px;
  }
  .panel-section {
    margin-bottom: 25px;

    h4 {
      margin-bottom: 10px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }

    .structure-settings {
      .setting-item {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;

        span:first-child {
          width: 50px;
          font-size: 12px;
        }

        .el-slider {
          flex: 1;
        }

        span:last-child {
          width: 30px;
          font-size: 12px;
          text-align: right;
        }
      }
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .floorplan-reference {
      .floorplan-preview {
        position: relative;
        width: 100%;
        margin-bottom: 10px;
        .floorplan-item {
          width: 117px;
          height: 117px;
          position: relative;
        }
        .floorplan-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          margin-right: 4px;
          border: 1px solid #444;
          border-radius: 4px;
        }
        .room-labels {
          position: absolute;
          top: -17px;
          right: -19px;
          width: 0;
          height: 0;
          border: 18px solid var(--el-color-success);
          border-bottom-color: transparent;
          border-top-color: transparent;
          border-left-color: transparent;
          transform: rotateZ(135deg);
          border-radius: 4px;
        }
      }
    }
  }
}
.w-100 {
  width: 100%;
}
</style>
