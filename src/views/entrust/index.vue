<template>
  <div class="entrust-container">
    <el-card class="box-card-container" style="height:140px;">
      <span class="box-card-title">作业委托书申请</span>
      <el-row style="height:40px;margin-left:20px;margin-top:25px;">
        <el-button type="primary" :disabled="applyCardVisible" @click.native.prevent="startEntrustApply">开始申请</el-button>
        <el-button type="danger" :disabled="!applyCardVisible" @click.native.prevent="rollbackEntrustApply">重置表单</el-button>
      </el-row>
    </el-card>
    <el-collapse-transition>
      <el-card v-if="applyCardVisible" class="box-card-container-switch" style="height:830px;" shadow="hover">
        <el-row style="height:40px"><div class="box-card-label">进港船舶</div></el-row>
        <el-row style="height:40px;margin-left:20px;">
          <el-select
            v-model="applyData.craft"
            filterable
            placeholder="请选择"
            @change="applyCraftChange(applyData.craft)"
          >
            <el-option
              v-for="item in applyCraftLabel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-row>
        <el-collapse-transition>
          <el-card v-if="applyCraftCardVisible" style="height:165px;margin-left:20px;margin-top:10px;width:40%">
            <el-container>
              <el-aside width="40%"><el-avatar shape="square" :size="130" fit="contain" :src="applyCraftShow.portrait" class="box-card-avatar-ship" /></el-aside>
              <el-main width="60%" style="padding-top:8px;">
                <el-row><el-col :span="7" class="box-card-item-ship">呼号:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applyCraftShow.letter }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="7" class="box-card-item-ship">IMO:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applyCraftShow.imo }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="7" class="box-card-item-ship">MMSI:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applyCraftShow.mmsi }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="7" class="box-card-item-ship" style="margin-top:7px;">类型:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;"><el-tag type="primary">{{ applyCraftShow.type }}</el-tag></el-col></el-row>
              </el-main>
            </el-container>
          </el-card>
        </el-collapse-transition>
        <el-row style="height:40px;margin-top:10px;"><div class="box-card-label">货物信息</div></el-row>
        <el-container style="margin-top:10px;">
          <el-aside width="40%">
            <el-row style="height:40px;">
              <el-col :span="9"><div class="box-card-goods">货物名</div></el-col>
              <el-col :span="12" style="margin-left:10px;"><el-input v-model="applyData.goods.name" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px;margin-top:10px;">
              <el-col :span="9"><div class="box-card-goods">货物标签</div></el-col>
              <el-col :span="12" style="margin-left:10px;"><el-input v-model="applyData.goods.signature" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:60px;margin-top:10px;">
              <el-col :span="9"><div class="box-card-goods">货物包装</div></el-col>
              <el-col :span="12" style="margin-left:10px;"><el-input v-model="applyData.goods.pack" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
          </el-aside>
          <el-main width="60%" style="padding-top:0px;">
            <el-row style="height:40px;">
              <el-col :span="6"><div class="box-card-goods">数量</div></el-col>
              <el-col :span="8" style="margin-left:15px;"><el-input-number v-model="applyData.goods.value" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
            </el-row>
            <el-row style="height:40px;margin-top:10px;">
              <el-row style="height:40px;">
                <el-col :span="6"><div class="box-card-goods">净重/T</div></el-col>
                <el-col :span="8" style="margin-left:15px;"><el-input-number v-model="applyData.goods.weight" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
              </el-row>
            </el-row>
            <el-row style="height:40px;margin-top:10px;">
              <el-row style="height:40px;">
                <el-col :span="6"><div class="box-card-goods">体积/m³</div></el-col>
                <el-col :span="8" style="margin-left:15px;"><el-input-number v-model="applyData.goods.volume" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
              </el-row>
            </el-row>
          </el-main>
        </el-container>
        <el-row style="height:40px;"><div class="box-card-label">预到港日期</div></el-row>
        <el-row style="padding-left:20px;">
          <el-date-picker
            v-model="applyData.arrive"
            type="datetime"
            placeholder="选择日期时间"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-row>
        <el-row style="height:40px;margin-top:10px;"><div class="box-card-label">合同材料</div></el-row>
        <el-row>
          <el-col :span="6">
            <el-upload
              ref="uploadEntrustApply"
              class="box-card-avatar"
              action="http://localhost:11088/entrust/update/portrait"
              multiple
              :limit="1"
              :file-list="applyAvatarList"
              :on-preview="handlePictureCardPreview"
              :on-exceed="handleApplyExceed"
              :on-success="handleApplySuccess"
              :on-remove="handleApplyRemove"
            >
              <el-button type="success">点击上传</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :modal="false"><img width="80%" :src="dialogImageUrl" alt=""></el-dialog>
          </el-col>
        </el-row>
        <el-row style="margin-left:20px;margin-top:20px;">
          <el-button type="primary" :disabled="isApplyAble" @click.native.prevent="entrustApplyRequest">确认申请</el-button>
        </el-row>
      </el-card>
    </el-collapse-transition>
    <el-card class="box-card-container" style="height:600px;">
      <span class="box-card-title">作业委托书列表</span>
      <el-table
        :data="entrustListData"
        :show-overflow-tooltip="true"
        style="width: 95%;margin-top:20px;"
        height="500"
        empty-text="暂无已提交的作业委托书"
      >
        <el-table-column prop="appkey" label="工单编号" width="150" align="center" />
        <el-table-column
          prop="craft"
          label="进港船舶"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="primary"
            >{{ scope.row.craft }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="货物类型" width="100" align="center" />
        <el-table-column prop="arrive" label="预进港时间" width="200" align="center" />
        <el-table-column
          prop="status"
          label="审批状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="entrustRowType(scope.row.status)"
            >{{ entrustRowText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="entrustGetInfo(scope.row.appkey,1)"
            >查看详情</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              :disabled="entrustRowButtonDisabled(scope.row.status)"
              @click="entrustGetInfo(scope.row.appkey,2)"
            >修改/删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card-container" style="height:600px;">
      <span class="box-card-title">已入港货物一览</span>
      <el-table
        :data="goodsListData"
        :show-overflow-tooltip="true"
        style="width: 95%;margin-top:20px;"
        height="500"
        empty-text="暂无已入港的货物信息"
      >
        <el-table-column prop="appkey" label="工单编号" width="150" align="center" />
        <el-table-column
          prop="restore"
          label="存放地点"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              type="primary"
            >{{ goodsRowText(scope.row.restore) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="货物类型" width="120" align="center" />
        <el-table-column prop="signature" label="货物标志" width="100" align="center" />
        <el-table-column prop="pack" label="货物包装" width="100" align="center" />
        <el-table-column prop="value" label="数量" width="100" align="center" />
        <el-table-column prop="weight" label="净重/T" width="100" align="center" />
        <el-table-column prop="volume" label="体积/m³" width="100" align="center" />
      </el-table>
    </el-card>

    <el-drawer
      title="作业委托书信息"
      :visible.sync="entrustInfoVisible"
      :before-close="handleClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">作业委托书信息</el-row>
      <div style="height:300px">
        <el-container>
          <el-aside width="50%">
            <el-row style="height:30px"><div class="box-card-label-change">进港船舶</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="entrustInfo.craft" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">预进港时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="entrustInfo.arrive"
                :disabled="entrustInfoInputDisable"
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="entrustInfo.name" size="medium" :disabled="entrustInfoInputDisable" /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">合同文件</div></el-row>
            <el-row>
              <el-col :span="18">
                <el-upload
                  ref="entrustInfoFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/entrust/update/portrait"
                  :disabled="entrustInfoInputDisable"
                  multiple
                  :limit="1"
                  :file-list="applyAvatarList"
                  :on-preview="handlePictureCardPreview"
                  :on-exceed="handleApplyExceed"
                  :on-success="handleApplySuccess"
                  :on-remove="handleApplyRemove"
                >
                  <el-button v-if="!entrustInfoInputDisable" type="success">点击上传</el-button>
                </el-upload>
              </el-col>
              <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img width="80%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-row>
          </el-aside>
          <el-main width="50%" style="padding: 0 0 0 0;">
            <el-row style="height:30px;"><div class="box-card-label-change">货物标志</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="entrustInfo.signature" size="medium" :disabled="entrustInfoInputDisable" /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物包装</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="entrustInfo.pack" size="medium" :disabled="entrustInfoInputDisable" /></el-col></el-row>
            <el-row style="height:30px;margin-top:11px;"><div class="box-card-label-change">数量</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="entrustInfo.value" size="medium" :precision="2" :step="0.01" :disabled="entrustInfoInputDisable" /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">净重/T</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="entrustInfo.weight" size="medium" :precision="2" :step="0.01" :disabled="entrustInfoInputDisable" /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">体积/m³</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="entrustInfo.volume" size="medium" :precision="2" :step="0.01" :disabled="entrustInfoInputDisable" /></el-col></el-row>
          </el-main>
        </el-container>
        <el-row style="height:40px;margin-top:30px;margin-left:20px;">
          <el-button type="primary" :disabled="entrustInfoInputDisable||isEntrustUpdateAble" @click.native.prevent="startUpdateEntrust">确认提交</el-button>
          <el-button type="danger" :disabled="entrustInfoInputDisable" @click.native.prevent="startDeleteEntrust">删除</el-button>
        </el-row>
        <div v-if="entrustInfo.flag === true" style="margin-left:20px;margin-top:30px;height:200px;width:85%">
          <el-row style="height:30px"><div class="box-card-result-label">审批结果</div></el-row>
          <el-row style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">审批人</div></el-col>
            <el-col :span="8" style="padding-top:2px;color:#409EFF">{{ entrustInfo.approve }}</el-col>
          </el-row>
          <el-row v-if="entrustInfo.result === false" style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">修改意见</div></el-col>
            <el-col :span="16">
              <el-input
                v-model="entrustInfo.review"
                type="textarea"
                disabled
                :rows="3"
                :maxlength="100"
                :show-word-limit="true"
              />
            </el-col>
          </el-row>
          <el-row v-if="entrustInfo.result === true" style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">存放地点</div></el-col>
            <el-col :span="8" style="padding-top:2px;color:#409EFF">{{ entrustInfo.restore }}号堆场</el-col>
          </el-row>
        </div>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <div style="height:400px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'
// eslint-disable-next-line no-unused-vars
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import 'element-ui/lib/theme-chalk/base.css'
import { getEntrustApplyCraftInfo, addEntrustApply, getEntrustInfo, getEntrustList, updateEntrust, delEntrust, getGoodsList } from '@/api/entrust'
import { searchUser } from '@/api/user'

export default {
  name: 'Entrust',
  rules: { 'vue/no-template-shadow': 'off' },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      searchApplyListInput: '',
      searchGoodsListInput: '',
      applyCardVisible: false,
      applyCraftLoading: false,
      applyCraftCardVisible: false,
      applyData: {
        account: '', craft: '', arrive: '', auth: '',
        goods: { name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0 }
      },
      applyCraftInfo: [],
      applyCraftLabel: [],
      applyAvatarList: [],
      applyCraftShow: { name: '', letter: '', imo: '', mmsi: '', type: '', status: '', portrait: '' },
      entrustListData: [],
      entrustInfo: {
        appkey: '', craft: '', arrive: '', auth: '',
        name: '', signature: '', pack: ' ', value: 0.0, weight: 0.0, volume: 0.0, restore: 0,
        flag: false, result: false, approve: '', review: ''
      },
      entrustInfoInputDisable: false,
      entrustInfoVisible: false,
      goodsListData: []
    }
  },
  computed: {
    ...mapGetters({
      token: 'token',
      flag: 'flag',
      userinfo: 'userinfo'
    }),
    isApplyAble() {
      return (this.applyData.craft === '' ||
        this.applyData.arrive === '' ||
        this.applyData.goods.name === '' ||
        this.applyData.goods.value <= 0 ||
        this.applyData.goods.weight <= 0 ||
        this.applyData.goods.volume <= 0 ||
        this.applyCraftCardVisible === false
      )
    },
    permissionResForApply() { return this.userinfo.grade === 2 },
    permissionResForSearch() { return this.userinfo.grade === 1 },
    isEntrustUpdateAble() { return this.entrustInfo.name === '' }
  },
  created() {
    this.applyCardVisible = this.permissionResForApply
    this.initAllList()
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    initEntrustList() {
      getEntrustList(this.userinfo.account).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.entrustListData = list
        } else { this.entrustListData = [] }
      })
    },
    initGoodsList() {
      getGoodsList(this.userinfo.account).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.goodsListData = list
        } else { this.goodsListData = [] }
      })
    },
    initAllList() {
      this.initEntrustList()
      this.initGoodsList()
    },
    goodsRowText(restore) { return restore + '号堆场' },
    async startEntrustApply() {
      this.applyAvatarList = []
      await getEntrustApplyCraftInfo(this.userinfo.account).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.applyCraftInfo = list
          this.applyCraftInfo.forEach((element) => {
            this.applyCraftLabel.push({
              value: element.name,
              label: element.name
            })
          })
        }
      })
      this.applyCardVisible = true
    },
    rollbackEntrustApply() {
      this.applyCardVisible = false
      this.applyCraftCardVisible = false
      this.applyCraftInfo = []
      this.applyCraftLabel = []
      this.applyCraftShow = { name: '', letter: '', imo: '', mmsi: '', type: '', status: '', portrait: '' }
      this.applyData = { account: '', craft: '', arrive: '', auth: '',
        goods: { name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0 }
      }
      this.applyAvatarList = []
    },
    applyCraftChange(value) {
      this.applyCraftInfo.forEach((element) => {
        if (element.name === value) { this.applyCraftShow = element }
      })
      this.applyCraftCardVisible = true
    },
    handleApplyExceed(files, fileList) {
      Message.warning('材料数量超出限制')
    },
    handleApplySuccess(response, file, fileList) {
      const { flag, mes } = response
      if (flag === false) {
        Message.error(mes)
      } else {
        const index = mes.indexOf('###')
        this.applyAvatarList = []
        this.applyAvatarList.push({
          name: mes.substring(index + 3),
          url: mes.substring(0, index)
        })
        Message.success('上传成功')
      }
    },
    handleApplyRemove(file, fileList) {
      this.applyAvatarList = []
      Message.info('删除成功')
    },
    async entrustApplyRequest() {
      this.applyData.account = this.userinfo.account
      if (this.applyAvatarList.length > 0) {
        // eslint-disable-next-line no-unused-vars
        const { name, url } = this.applyAvatarList.pop()
        this.applyData.auth = url
      }
      if (this.applyData.auth === '') { this.applyData.auth = null }
      if (this.applyData.goods.signature === '') { this.applyData.goods.signature = null }
      if (this.applyData.goods.pack === '') { this.applyData.goods.pack = null }
      await addEntrustApply(this.applyData).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success(mes)
          this.rollbackEntrustApply()
        } else { Message.warning(mes) }
        this.initAllList()
      })
    },
    entrustRowType(val) {
      if (val === 1) { return 'info' }
      if (val === 2) { return 'warning' }
      if (val === 3) { return 'danger' }
      if (val === 4) { return 'success' }
    },
    entrustRowText(val) {
      if (val === 1) { return '等待审批' }
      if (val === 2) { return '审批中' }
      if (val === 3) { return '未通过' }
      if (val === 4) { return '审批通过' }
    },
    entrustRowButtonDisabled(val) { return val === 2 || val === 4 },
    async entrustGetInfo(appkey, position) {
      if (position === 1) { this.entrustInfoInputDisable = true }
      await getEntrustInfo(appkey).then((res) => {
        this.entrustInfo = res
        this.applyAvatarList = []
        if (this.entrustInfo.auth != null) {
          const index = this.entrustInfo.auth.indexOf('/entrust/')
          const fileName = this.entrustInfo.auth.substring(index + 9)
          this.applyAvatarList.push({
            name: fileName,
            url: this.entrustInfo.auth
          })
        }
      })
      this.entrustInfoVisible = true
    },
    handleClose() {
      this.entrustInfoVisible = false
      this.entrustInfoInputDisable = false
      this.entrustInfo = { appkey: '', craft: '', arrive: '', auth: '',
        name: '', signature: '', pack: ' ', value: 0.0, weight: 0.0, volume: 0.0, restore: 0,
        flag: false, result: false, approve: '', review: ''
      }
      this.applyAvatarList = []
      this.initAllList()
    },
    async startUpdateEntrust() {
      let data
      if (this.applyAvatarList.length > 0) {
        // eslint-disable-next-line no-unused-vars
        const { name, url } = this.applyAvatarList.pop()
        data = {
          appkey: this.entrustInfo.appkey,
          arrive: this.entrustInfo.arrive,
          auth: url,
          name: this.entrustInfo.name,
          signature: this.entrustInfo.signature,
          pack: this.entrustInfo.pack,
          value: this.entrustInfo.value,
          weight: this.entrustInfo.weight,
          volume: this.entrustInfo.volume
        }
      } else {
        data = {
          appkey: this.entrustInfo.appkey,
          arrive: this.entrustInfo.arrive,
          auth: null,
          name: this.entrustInfo.name,
          signature: this.entrustInfo.signature === '' ? null : this.entrustInfo.signature,
          pack: this.entrustInfo.pack === '' ? null : this.entrustInfo.pack,
          value: this.entrustInfo.value,
          weight: this.entrustInfo.weight,
          volume: this.entrustInfo.volume
        }
      }
      await updateEntrust(data).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes } = res
        Message.success(mes)
        this.handleClose()
      })
    },
    async startDeleteEntrust() {
      await delEntrust(this.entrustInfo.appkey).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes } = res
        Message.success(mes)
        this.handleClose()
      })
    },
    async searchApplyList(account) {
      let info = null
      await searchUser(account === '' ? this.userinfo.account : account).then((res) => {
        const { flag, grade } = res
        if (flag === false) {
          Message.info('未查找到指定的用户')
        } else {
          if (grade === 2) {
            Message.info('该用户为审批用户')
          } else { info = account }
        }
      })
      if (info != null) {
        await getEntrustList(info).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, num, list } = res
          if (flag === true) {
            Message.success('拉取数据成功')
            this.entrustListData = list
          } else { this.entrustListData = [] }
        })
      }
    },
    async searchGoodsList(account) {
      let info = null
      await searchUser(account === '' ? this.userinfo.account : account).then((res) => {
        const { flag, grade } = res
        if (flag === false) {
          Message.info('未查找到指定的用户')
        } else {
          if (grade === 2) {
            Message.info('该用户为审批用户')
          } else { info = account }
        }
      })
      if (info != null) {
        getGoodsList(info).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, num, list } = res
          if (flag === true) {
            Message.success('拉取数据成功')
            this.goodsListData = list
          } else { this.goodsListData = [] }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@font-face {
  font-family: "title-regular";
  font-weight: 400;
  src: url("../../icons/font/regular.woff2") format("woff2"),
  url("../../icons/font/regular.woff") format("woff");
  font-display: swap;
}
body {}
.entrust-container {}
.box-card-goods {
  font-family: title-regular;
  font-size:18px;
  margin-left:40px;
  margin-top:8px;
}
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
.box-card-result-label {
  font-family: title-regular;
  font-size:18px;
}
.box-card-avatar {
  margin-left:20px;
}
.box-card-label {
  font-family: title-regular;
  font-size: 18px;
  padding-top:10px;
  padding-left:20px;
}
.box-card-title {
  font-family: title-regular;
  font-size:22px;
  padding-left:20px;
}
.box-card-title-drawer {
  font-family: title-regular;
  font-size:22px;
  padding-left:20px;
  padding-top:20px;
  margin-bottom: 30px;
}
.box-card-label-ship {
  font-family: title-regular;
  font-size: 18px;
}
.box-card-item-ship {
  font-family: title-regular;
  font-size: 15px;
}
.box-card-aside {
  margin-left:20px;
  margin-top:10px
}
.input-with-select{
  background-color: #fff;
  width: 70%;
  margin-left: 20px;
  margin-top: 20px;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
</style>
<style>
.el-drawer.rtl{
  overflow: scroll;
}
</style>
