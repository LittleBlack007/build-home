<template>
  <section class="home-box">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="left-panel">
        <Logo />
        <div class="panel-section">
          <h4>分辨率</h4>
          <el-button type="primary" size="small">1024×576</el-button>
        </div>
        <div class="panel-section">
          <h4>图片数量</h4>
          <el-radio-group v-model="imageCount" size="small">
            <el-radio-button
              v-for="item in imageCountEnum"
              :key="item.label"
              :value="item.label"
            >{{ item.value }}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="panel-section">
          <h4>设计风格</h4>
          <el-radio-group v-model="designStyle" size="small">
            <el-radio-button
              v-for="item in designStyleEnum"
              :key="item.label"
              :value="item.label"
            >{{ item.value }}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="panel-section">
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
        </div>

        <div class="panel-section">
          <h4>特殊描述</h4>
          <el-input v-model="specialDesc" type="textarea" :rows="2" placeholder="请输入特殊描述" size="small" />
        </div>

        <div class="panel-section">
          <h4>图片参考</h4>
          <el-upload
            v-model:file-list="fileList"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            +
          </el-upload>
        </div>
      </div>

      <!-- 中央3D视图区域 -->
      <div class="center-view">
        <div class="model-view">
          <!-- 这里放置3D模型视图 -->
          <img src="https://picsum.photos/id/1019/800/600" alt="3D模型视图" class="model-image" />
        </div>
        <div class="inspiration-library">
          <div class="inspiration-item" v-for="i in 3" :key="i">
            <img :src="`https://picsum.photos/id/${1040 + i}/100/60`" alt="灵感${i}" />
          </div>
        </div>
      </div>

      <!-- 右侧结构设置面板 -->
      <div class="right-panel">
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
      </div>
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
} from './enums.js'
// 响应式数据
const spaceDefinition = ref('livingroom')
const activeTab = ref('basic')
const imageCount = ref(2)
const designStyle = ref('modern')
const specialDesc = ref('')
const viewAngle = ref('camera')
const zoom = ref(100)
const wallHeight = ref(100)
const displayOption = ref('all')

// 空间尺寸
const space = ref({
  long: 0,
  width: 0,
  height: 0,
})

const imageList = reactive([
  "https://cdn.uviewui.com/uview/swiper/1.jpg",
  "https://cdn.uviewui.com/uview/swiper/swiper1.png",
  "https://cdn.uviewui.com/uview/swiper/swiper2.png",
]);

const imageContainer = ref(null)

const initializeViewer = () => {
  new Viewer(imageContainer.value, {
    navbar: true,
    title: true,
    toolbar: {
      prev: true,
      next: true,
    },
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


const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
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
  background-color: #2d2d2d;
  color: #fff;
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
  width:300px;
  background-color: #1e1e1e;
  padding: 8px;
  overflow-y: auto;
  border-right: 1px solid #444;
  position: relative;
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
}

/* 中央3D视图区域 */
.center-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2d2d2d;
  flex-direction: column;
  
  .model-view {
    position: relative;
    width: 98%;
    height: calc(100% - 90px);
    border: 1px solid #444;

    .model-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .inspiration-library {
    padding-left: 9px;
    margin: 8px 0;
    display: flex;
    gap: 10px;
    width: 100%;
    .inspiration-item {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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
