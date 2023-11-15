<template>
  <div class="personal-container">
    <el-card class="box-card-container" style="height:450px;">
      <span class="box-card-title">基本信息</span>
      <el-container style="padding-top:15px;height:330px">
        <el-aside style="width:60%;">
          <el-row style="height:40px"><div class="box-card-label">用户名</div></el-row>
          <el-row style="height:40px"><el-col :span="17" style="padding-left:20px"><el-input v-model="userinfo.account" size="medium" :disabled="true" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">昵称</div></el-row>
          <el-row style="height:40px"><el-col :span="17" style="padding-left:20px"><el-input v-model="name" size="medium" :disabled="isNameAble" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">用户类型</div></el-row>
          <el-row style="height:40px"><el-col :span="17" style="padding-left:20px"><el-input v-model="grade" size="medium" :disabled="true" /></el-col></el-row>
        </el-aside>
        <el-main style="width:40%;padding:0 0 0 0">
          <el-row style="height:40px"><div class="box-card-label">用户头像</div></el-row>
          <el-row>
            <el-avatar shape="square" :size="150" fit="contain" :src="fileList[0].url" class="box-card-avatar" />
            <el-avatar shape="square" :size="65" fit="contain" :src="fileList[0].url" class="box-card-avatar" />
          </el-row>
          <el-row>
            <el-upload
              ref="upload"
              class="box-card-avatar"
              accept=".jpeg,.png,.jpg"
              action="http://localhost:11088/user/update/portrait"
              multiple
              :file-list="fileList"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
            >
              <el-button slot="trigger" size="medium" round type="primary" :disabled="isNameAble">选取头像</el-button>
              <div slot="tip" class="el-upload__tip">支持 jpeg / jpg / png</div>
            </el-upload>
          </el-row>
        </el-main>
      </el-container>
      <div v-if="showChangeBasicInfo">
        <transition name="el-fade-in-linear"><el-button type="primary" class="box-card-avatar" @click.native.prevent="startChangeBasicInfo">修改信息</el-button></transition>
      </div>
      <div v-if="showSaveBasicInfo">
        <transition name="el-fade-in-linear"><el-button type="success" class="box-card-avatar" @click.native.prevent="saveChangeBasicInfo">保存修改</el-button></transition>
        <transition name="el-fade-in-linear"><el-button type="danger" class="box-card-avatar" @click.native.prevent="resetChangeBasicInfo">取消修改</el-button></transition>
      </div>
    </el-card>
    <el-card class="box-card-container" style="height:390px">
      <span class="box-card-title">修改密码</span>
      <div style="padding-top:15px;height:270px">
        <el-row style="height:40px"><div class="box-card-label">原密码</div></el-row>
        <el-row style="height:40px"><el-col :span="10" style="padding-left:20px"><el-input v-model="passwordInput.oldPass" size="medium" /></el-col></el-row>
        <el-row style="height:40px"><div class="box-card-label">新密码</div></el-row>
        <el-row style="height:40px"><el-col :span="10" style="padding-left:20px"><el-input v-model="passwordInput.newPass" size="medium" show-password /></el-col></el-row>
        <el-row style="height:40px"><div class="box-card-label">重复新密码</div></el-row>
        <el-row style="height:40px"><el-col :span="10" style="padding-left:20px"><el-input v-model="passwordInput.confirmPass" size="medium" show-password /></el-col></el-row>
      </div>
      <el-button type="primary" class="box-card-avatar" @click.native.prevent="startChangePassword">确认修改</el-button>
    </el-card>
    <el-card class="box-card-container" style="height:260px">
      <span class="box-card-title">绑定信息</span>
      <el-row style="height:40px;margin-top:20px;">
        <el-col :span="4" class="box-card-label">用户邮箱</el-col>
        <el-link v-if="hasBindEmail" class="box-card-bind" :span="4" type="warning" @click.native.prevent="emailDialogVisible=true">暂无绑定邮箱,点此绑定</el-link>
        <el-link v-if="!hasBindEmail" class="box-card-bind" :span="4" type="success">{{ userinfo.email }}</el-link>
      </el-row>
      <el-row style="height:40px;margin-top:20px;">
        <el-col :span="4" class="box-card-label">用户认证</el-col>
        <el-link v-if="hasLicense" class="box-card-bind" :span="4" type="warning" @click.native.prevent="licenseDrawerInit">暂无许可证,点此申请</el-link>
        <el-link v-if="hasWaitLicense" class="box-card-bind" :span="4" type="warning" @click.native.prevent="licenseDrawerInit">等待审批中,点此修改</el-link>
        <el-link v-if="hasDoingLicense" class="box-card-bind" :span="4" type="warning" @click.native.prevent="licenseDrawerInit">正在审批中,点此查看</el-link>
        <el-link v-if="hasErrorLicense" class="box-card-bind" :span="4" type="danger" @click.native.prevent="licenseDrawerInit">审批未通过,点此修改</el-link>
        <el-link v-if="hasAccessLicense" class="box-card-bind" :span="4" type="success">已通过认证</el-link>
      </el-row>
      <el-button type="danger" style="margin-top:20px;margin-left:20px;" :disabled="hasBindEmail" @click.native.prevent="confirmBindEmail">解绑邮箱</el-button>
    </el-card>
    <el-collapse-transition>
      <el-card v-if="confirmDialogVisible" class="box-card-container-switch" style="height:620px;" shadow="hover">
        <div style="height:140px">
          <el-row style="height:40px"><div class="box-card-label">验证码</div></el-row>
          <el-row style="height:40px"><el-col :span="4" style="padding-left:20px"><el-input v-model="confirmEmailCode" size="medium" /></el-col></el-row>
          <el-button type="danger" style="margin-top:20px;margin-left:20px;" :disabled="isDelEmailAble" @click.native.prevent="startDelEmail">确认</el-button>
          <el-button type="info" style="margin-left:20px;" @click.native.prevent="rollbackConfirm">取消</el-button>
        </div>
      </el-card>
    </el-collapse-transition>
    <div style="height:400px;" />

    <el-drawer
      title="邮箱绑定"
      :visible.sync="emailDialogVisible"
      :before-close="handleClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">绑定邮箱</el-row>
      <div style="height:300px">
        <el-row style="height:30px"><div class="box-card-label-change">邮箱地址</div></el-row>
        <el-row style="height:40px;">
          <el-col :span="7" style="padding-left:20px;padding-top:5px;"><el-input v-model="emailInput.firstEmail" size="medium" /></el-col>
          <el-col :span="6" style="padding-left:5px;padding-top:3px;">
            <el-select v-model="emailInput.lastEmail" placeholder="请选择">
              <el-option
                v-for="item in emailOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row style="padding-left:20px;height:40px;padding-top:20px;margin-bottom:30px;">
          <el-button type="primary" :disabled="isVerifyCodeAble" @click.native.prevent="sendEmailVerifyCode">发送验证码</el-button>
        </el-row>
        <el-row style="height:40px;"><div class="box-card-label">验证码</div></el-row>
        <el-row style="height:40px"><el-col :span="7" style="padding-left:20px"><el-input v-model="emailInput.code" size="medium" /></el-col></el-row>
        <el-row style="padding-top:10px;">
          <el-button type="primary" class="box-card-avatar" :disabled="isBindEmailAble" @click.native.prevent="startBindEmail">确认绑定</el-button>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="申请许可证"
      :visible.sync="licenseDialogVisible"
      :before-close="handleClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">申请许可证</el-row>
      <div style="height:300px">
        <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="licenseInput.account" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">所属公司</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="licenseInput.company" size="medium" :disabled="hasDoingLicense" /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">真实姓名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="licenseInput.name" size="medium" :disabled="hasDoingLicense" /></el-col></el-row>
        <el-row style="height:30px;margin-top:20px;"><div class="box-card-label-change">证明材料</div></el-row>
        <el-row>
          <el-upload
            ref="uploadLicense"
            class="box-card-avatar"
            accept=".jpeg,.png,.jpg"
            action="http://localhost:11088/license/update/portrait"
            :disabled="hasDoingLicense"
            multiple
            :limit="1"
            :file-list="licenseList"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleLicenseExceed"
            :on-success="handleLicenseSuccess"
            :on-remove="handleLicenseRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="80%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-row>
        <el-row style="height:40px;margin-top:30px;margin-left:20px;">
          <el-button type="primary" :disabled="isLicenseUpdateAble" @click.native.prevent="startBindLicense">确认提交</el-button>
          <el-button type="danger" :disabled="isLicenseDelAble" @click.native.prevent="startDelLicense">删除</el-button>
        </el-row>
        <div v-if="isReviewCardAble" style="margin-left:20px;margin-top:30px;height:200px;width:85%">
          <el-row style="height:30px"><div class="box-card-result-label">审批结果</div></el-row>
          <el-row style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">审批人</div></el-col>
            <el-col :span="8" style="padding-top:2px;color:#409EFF">{{ licenseInfo.approve }}</el-col>
          </el-row>
          <el-row style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">修改意见</div></el-col>
            <el-col :span="16">
              <el-input
                v-model="licenseInfo.review"
                type="textarea"
                disabled
                :rows="3"
                :maxlength="100"
                :show-word-limit="true"
              />
            </el-col>
          </el-row>
        </div>
        <div style="height:100px;" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { sendVerifyEmail, confirmEmail, bindLicense, getLicense, updateLicense } from '@/api/user'
import { confirm } from '@/api/approve'
import 'element-ui/lib/theme-chalk/base.css'
// eslint-disable-next-line no-unused-vars
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
export default {
  name: 'Personal',
  rules: { 'vue/no-template-shadow': 'off' },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      showChangeBasicInfo: true,
      showSaveBasicInfo: false,
      isLicenseUpdateAble: true,
      isLicenseDelAble: true,
      isNameAble: true,
      grade: '',
      name: '',
      fileList: [],
      licenseList: [],
      passwordInput: { oldPass: '', newPass: '', confirmPass: '' },
      emailDialogVisible: false,
      licenseDialogVisible: false,
      emailInput: { firstEmail: '', lastEmail: '', code: '' },
      licenseInput: { account: '', company: '', name: '' },
      verifyCode: '',
      hasSentEmail: false,
      confirmDialogVisible: false,
      confirmEmailCode: '',
      emailOptions: [
        { value: '@163.com', label: '@163.com' },
        { value: '@126.com', label: '@126.com' },
        { value: '@qq.com', label: '@qq.com' },
        { value: '@gmail.com', label: '@gmail.com' },
        { value: '@whut.edu.cn', label: '@whut.edu.cn' }
      ],
      licenseInfo: {
        account: '', company: '', name: '', auth: '', appkey: '',
        flag: false, result: false, approve: '', review: '' }
    }
  },
  computed: {
    ...mapGetters({
      token: 'token',
      flag: 'flag',
      userinfo: 'userinfo'
    }),
    isVerifyCodeAble() { return !((this.emailInput.firstEmail.length >= 3) && (this.emailInput.lastEmail.length >= 3) && !this.hasSentEmail) },
    isBindEmailAble() { return !(this.hasSentEmail && this.emailInput.code.toUpperCase() === this.verifyCode && this.emailInput.code.length >= 4) },
    hasBindEmail() {
      if (this.userinfo.email === null) { return true }
      return !(this.userinfo.email.length >= 3)
    },
    hasLicense() { return this.userinfo.enable === 0 },
    hasWaitLicense() { return this.userinfo.enable === 1 },
    hasDoingLicense() { return this.userinfo.enable === 2 },
    hasErrorLicense() { return this.userinfo.enable === 3 },
    hasAccessLicense() { return this.userinfo.enable === 4 },
    isDelEmailAble() { return !((this.confirmEmailCode.toUpperCase() === this.verifyCode) && (this.confirmEmailCode.length >= 4)) },
    isReviewCardAble() { return this.licenseInfo.flag === true && this.licenseInfo.result === false }
  },
  created() {
    if (this.userinfo.grade === 1) { this.grade = '客户用户' }
    if (this.userinfo.grade === 2) { this.grade = '审批用户' }
    if (this.userinfo.grade === 3) { this.grade = '管理员用户' }
    this.name = this.userinfo.name
    this.showChangeBasicInfo = true
    this.showSaveBasicInfo = false
    this.isNameAble = true
    this.fileList.push({
      name: 'origin.jpeg',
      url: this.userinfo.portrait
    })
    this.passwordInput = { oldPass: '', newPass: '', confirmPass: '' }
  },
  methods: {
    handleLicenseExceed(files, fileList) { Message.warning('图片数量超出限制') },
    handleLicenseSuccess(response, file, fileList) {
      const { flag, mes } = response
      if (flag === false) {
        Message.error(mes)
      } else {
        this.licenseList = []
        this.licenseList.push({
          name: 'new.jpeg',
          url: mes
        })
        Message.success('上传图片成功')
      }
    },
    handleLicenseRemove(file, fileList) {
      this.licenseList = []
      Message.info('删除图片成功')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    startChangeBasicInfo() {
      this.isNameAble = false
      this.showChangeBasicInfo = false
      this.showSaveBasicInfo = true
    },
    saveChangeBasicInfo() {
      const basicInfo = {
        account: this.userinfo.account,
        name: this.name,
        portrait: this.fileList[0].url
      }
      this.$store.dispatch('user/updateBasic', basicInfo).then(() => {
        this.$store.dispatch('user/getInfo').then(() => {
          this.resetChangeBasicInfo()
        })
      })
    },
    resetChangeBasicInfo() {
      this.name = this.userinfo.name
      this.showChangeBasicInfo = true
      this.showSaveBasicInfo = false
      this.isNameAble = true
      this.fileList.pop()
      this.fileList.push({
        name: 'origin.jpeg',
        url: this.userinfo.portrait
      })
    },
    handleUploadSuccess(res) {
      const { flag, mes } = res
      if (flag === false) {
        Message.error(mes)
      } else {
        this.fileList = []
        this.fileList.push({
          name: 'new.jpeg',
          url: mes
        })
        Message.success('上传图片成功')
      }
    },
    startChangePassword() {
      if (!(this.passwordInput.oldPass === this.userinfo.password)) {
        Message.warning('原密码输入错误')
        return
      }
      if (!(this.passwordInput.newPass === this.passwordInput.confirmPass)) {
        Message.warning('两次新密码输入不一致')
        return
      }
      const passInfoReq = {
        account: this.userinfo.account,
        fore: this.userinfo.password,
        after: this.passwordInput.newPass
      }
      this.$store.dispatch('user/updatePass', passInfoReq).then(() => {
        this.$store.dispatch('user/getInfo').then(() => {
          if (this.passwordInput.newPass === this.userinfo.password) {
            this.passwordInput = { oldPass: '', newPass: '', confirmPass: '' }
          }
        })
      })
    },
    sendEmailVerifyCode() {
      sendVerifyEmail({
        account: this.userinfo.account,
        fore: this.emailInput.firstEmail,
        last: this.emailInput.lastEmail.substring(1)
      }).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          this.hasSentEmail = true
          this.verifyCode = mes
          Message.success('发送验证码成功')
        } else { Message.error(mes) }
      })
    },
    startBindEmail() {
      const emailInfo = {
        account: this.userinfo.account,
        fore: this.emailInput.firstEmail,
        last: this.emailInput.lastEmail.substring(1)
      }
      this.$store.dispatch('user/updateBindEmail', emailInfo).then(() => {
        this.$store.dispatch('user/getInfo').then(() => {
          this.handleClose()
        })
      })
    },
    confirmBindEmail() {
      confirmEmail({
        account: this.userinfo.account,
        email: this.userinfo.email
      }).then(res => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success('发送验证码成功')
          this.verifyCode = mes
        } else { Message.error(mes) }
      })
      this.confirmDialogVisible = true
    },
    rollbackConfirm() {
      this.verifyCode = ''
      this.confirmDialogVisible = false
    },
    startBindLicense() {
      if (this.licenseInput.company === '' || this.licenseInput.name === '') {
        Message.info('许可证申请信息不完整')
      } else {
        let data
        if (this.licenseList.length === 0) {
          data = {
            account: this.licenseInput.account,
            company: this.licenseInput.company,
            name: this.licenseInput.name,
            auth: null
          }
        } else {
          // eslint-disable-next-line no-unused-vars
          const { name, url } = this.licenseList.pop()
          data = {
            account: this.licenseInput.account,
            company: this.licenseInput.company,
            name: this.licenseInput.name,
            auth: url
          }
        }
        if (this.hasLicense) {
          bindLicense(data).then(res => {
            const { flag, mes } = res
            if (flag === false) {
              Message.warning(mes)
            } else {
              this.$store.dispatch('user/getInfo').then(() => { this.handleClose() })
              Message.success(mes)
            }
          })
        } else {
          updateLicense(data).then(res => {
            const { flag, mes } = res
            if (flag === false) {
              Message.warning(mes)
            } else {
              this.$store.dispatch('user/getInfo').then(() => { this.handleClose() })
              Message.success(mes)
            }
          })
        }
      }
    },
    handleClose() {
      this.emailDialogVisible = false
      this.licenseDialogVisible = false
      this.emailInput = {
        firstEmail: '',
        lastEmail: '',
        code: ''
      }
      this.licenseInput = {
        account: '',
        company: '',
        name: ''
      }
      this.licenseList = []
      this.hasSentEmail = false
      this.verifyCode = ''
      this.confirmDialogVisible = false
      this.confirmEmailCode = ''
    },
    startDelEmail() {
      const emailInfo = {
        account: this.userinfo.account,
        email: this.userinfo.email
      }
      this.$store.dispatch('user/delBindEmail', emailInfo).then(() => {
        this.$store.dispatch('user/getInfo').then(() => {
          this.handleClose()
        })
      })
    },
    startDelLicense() {
      this.$store.dispatch('user/delBindLicense', this.userinfo.account).then(() => {
        this.$store.dispatch('user/getInfo').then(() => {
          this.handleClose()
        })
      })
    },
    async licenseDrawerInit() {
      this.licenseInput.account = this.userinfo.account
      if (this.userinfo.enable > 0) {
        await getLicense(this.userinfo.account).then((res) => {
          this.licenseInfo = res
          Message.success('拉取许可证信息成功')
        })
        await confirm(this.licenseInfo.appkey).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, mes } = res
          this.isLicenseUpdateAble = !flag
          this.isLicenseDelAble = !flag
        })
        this.licenseInput.company = this.licenseInfo.company
        this.licenseInput.name = this.licenseInfo.name
        this.licenseList = []
        if (this.licenseInfo.auth != null) {
          this.licenseList.push({
            name: 'new.jpeg',
            url: this.licenseInfo.auth
          })
        }
      } else {
        this.isLicenseUpdateAble = false
        this.isLicenseDelAble = true
      }
      this.licenseDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "title-regular";
  font-weight: 400;
  src: url("../../icons/font/regular.woff2") format("woff2"),
  url("../../icons/font/regular.woff") format("woff");
  font-display: swap;
}
body {}
.personal-container {}
.box-card-container {
  width: 85%;
  background-color: white;
  margin-top: 40px;
  margin-left: 60px;
}
.box-card-container-switch {
  width: 85%;
  background-color: white;
  margin-left: 60px;
}
.box-card-result-label {
  font-family: title-regular;
  font-size:18px;
}
.box-card-title {
  font-family: title-regular;
  font-size:22px;
  padding-left:20px;
}
.box-card-label {
  font-family: title-regular;
  font-size: 18px;
  padding-top:10px;
  padding-left:20px;
}
.box-card-title-drawer {
  font-family: title-regular;
  font-size:22px;
  padding-left:20px;
  padding-top:20px;
  margin-bottom: 30px;
}
.box-card-label-change {
  font-family: title-regular;
  font-size: 18px;
  padding-left:20px;
  padding-bottom:0px;
}
.box-card-avatar {
  margin-top:10px;
  margin-left:20px;
}
.box-dialog-email {
  font-family: title-regular;
  font-size: 18px;
  padding-top: 5px;
  padding-left: 13px;
}
.box-card-bind {
  font-size:13px;
  margin-top:14px;
}
</style>
<style>
.el-drawer.rtl{
  overflow: scroll;
}
</style>
