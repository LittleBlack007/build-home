<template>
    <!-- <div class="logo-display">
        <div class="minimal-logo">
            <div class="minimal-icon">
                <div class="minimal-house">
                    <div class="minimal-roof"></div>
                    <div class="minimal-walls"></div>
                </div>
            </div>
            <div class="minimal-text"></div>
        </div>
    </div> -->
</template>

<style scoped lang="scss">
.minimal-logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.minimal-icon {
    width: 50px;
    height: 50px;
    background: #2c3e50;
    border-radius: 10px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.minimal-house {
    width: 30px;
    height: 30px;
    position: relative;
}

.minimal-roof {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 10px solid #e74c3c;
}

.minimal-walls {
    width: 30px;
    height: 20px;
    background: #3498db;
}

.minimal-text {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--el-color-primary);
}
</style>
