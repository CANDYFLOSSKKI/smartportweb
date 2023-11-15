<template>
  <div class="order-container">
    <el-card class="box-card-container" style="height:140px;">
      <span class="box-card-title">发货指令申请</span>
      <el-row style="height:40px;margin-left:20px;margin-top:25px;">
        <el-button type="primary" :disabled="applyCardVisible" @click.native.prevent="startApply">开始申请</el-button>
        <el-button type="danger" :disabled="!applyCardVisible" @click.native.prevent="rollbackApply">重置表单</el-button>
      </el-row>
    </el-card>
    <el-collapse-transition>
      <el-card v-if="applyCardVisible" class="box-card-container-switch" style="height:660px;" shadow="hover">
        <el-row style="height:40px"><div class="box-card-label">发货货物</div></el-row>
        <el-row style="height:40px;margin-left:20px;">
          <el-select
            v-model="applyOrderData.goods"
            filterable
            placeholder="请选择"
            @change="applyGoodsChange(applyOrderData.goods)"
          >
            <el-option
              v-for="item in applySpaceLabel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-row>
        <el-collapse-transition>
          <el-card v-if="applySpaceCardVisible" style="height:165px;margin-left:20px;margin-top:10px;margin-bottom:10px;width:40%">
            <el-container>
              <el-aside width="50%">
                <el-row><el-col :span="12" class="box-card-item-ship">货物名:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.name }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物标志:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.signature }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物包装:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.pack }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="11" class="box-card-item-ship" style="margin-top:7px;">存放地点:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;"><el-tag type="primary">{{ applySpaceData.restore }}号堆场</el-tag></el-col></el-row>
              </el-aside>
              <el-main width="50%" style="margin-top:0px;padding-top:0px;">
                <el-row><el-col :span="12" class="box-card-item-ship">总数量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.value }}</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总净重:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.weight }}T</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总体积:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.volume }}m³</el-col></el-row>
                <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">预约量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.process }}</el-col></el-row>
              </el-main>
            </el-container>
          </el-card>
        </el-collapse-transition>
        <el-container style="height:380px;">
          <el-aside width="40%">
            <el-row style="height:40px"><div class="box-card-label">货代公司</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="12"><el-input v-model="applyOrderData.agent" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货数量</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="11"><el-input-number v-model="applyOrderData.value" controls-position="right" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货方式</div></el-row>
            <el-row style="margin-left:20px;margin-top:5px;margin-bottom:5px;">
              <el-radio-group v-model="applyOrderData.type" @change="applyTypeChange">
                <el-radio :label="0">陆运</el-radio>
                <el-radio :label="1">船运</el-radio>
              </el-radio-group>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">船名/陆运车次</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="12">
                <el-input v-if="applyOrderData.type === 0" v-model="applyOrderData.wagon" size="medium" placeholder="请输入内容" />
                <el-select
                  v-if="applyOrderData.type === 1"
                  v-model="applyOrderData.craft"
                  filterable
                  placeholder="选择船舶"
                >
                  <el-option
                    v-for="item in applyCraftLabel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="60%" style="padding-top:0px;">
            <el-row style="height:40px"><div class="box-card-label">对接人</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="9"><el-input v-model="applyOrderData.name" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">联系电话</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="9"><el-input v-model="applyOrderData.phone" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">预提货时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="applyOrderData.arrive"
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">合同文件</div></el-row>
            <el-row>
              <el-col :span="11">
                <el-upload
                  ref="applyOrderFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/order/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="applyOrderFile"
                  :on-preview="handlePictureCardPreview"
                  :on-exceed="handleApplyExceed"
                  :on-success="handleApplySuccess"
                  :on-remove="handleApplyRemove"
                >
                  <el-button type="success">点击上传</el-button>
                </el-upload>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <el-row style="margin-left:20px;margin-top:20px;">
          <el-button type="primary" :disabled="isApplyAble" @click.native.prevent="orderApplyRequest">确认申请</el-button>
        </el-row>
      </el-card>
    </el-collapse-transition>

    <el-card class="box-card-container" style="height:600px;">
      <span class="box-card-title">发货指令列表</span>
      <el-table
        :data="orderListData"
        :show-overflow-tooltip="true"
        style="width: 95%;margin-top:20px;"
        height="500"
        empty-text="暂无已提交的发货指令"
      >
        <el-table-column prop="appkey" label="工单编号" width="150" align="center" />
        <el-table-column prop="agent" label="货代公司" width="150" align="center" />
        <el-table-column prop="arrive" label="预提货时间" width="160" align="center" />
        <el-table-column prop="type" label="发货方式" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="orderTypeType(scope.row.type)">{{ orderTypeText(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审批状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="orderStatusType(scope.row.status)">{{ orderStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="process" label="发货状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="orderProcessType(scope.row.process)">{{ orderProcessText(scope.row.process) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="startOrderInfo(scope.row.appkey,1)"
            >查看详情</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              :disabled="orderRowButtonDisabled(scope.row.status)"
              @click="startOrderInfo(scope.row.appkey,2)"
            >修改/删除</el-button>
            <el-button
              size="small"
              type="success"
              plain
              :disabled="scope.row.status !== 4 || scope.row.process === true"
              @click="startOrderProcess(scope.row.appkey)"
            >发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
      title="发货指令信息"
      :visible.sync="orderInfoDrawerVisible"
      :before-close="handleClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">发货指令信息</el-row>
      <div style="height:300px">
        <el-row style="height:40px"><div class="box-card-label">发货货物</div></el-row>
        <el-row style="height:40px;margin-left:20px;">
          <el-select
            v-model="orderInfoData.goods"
            :disabled="orderInfoInputDisable"
            filterable
            placeholder="请选择"
            @change="infoGoodsChange(orderInfoData.goods)"
          >
            <el-option
              v-for="item in applySpaceLabel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-row>
        <el-card style="height:165px;margin-left:20px;margin-top:10px;margin-bottom:10px;width:60%">
          <el-container>
            <el-aside width="50%">
              <el-row><el-col :span="12" class="box-card-item-ship">货物名:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.name }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物标志:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.signature }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物包装:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.pack }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="11" class="box-card-item-ship" style="margin-top:7px;">存放地点:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;"><el-tag type="primary">{{ applySpaceData.restore }}号堆场</el-tag></el-col></el-row>
            </el-aside>
            <el-main width="50%" style="margin-top:0px;padding-top:0px;">
              <el-row><el-col :span="12" class="box-card-item-ship">总数量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.value }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总净重:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.weight }}T</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总体积:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.volume }}m³</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">预约量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ applySpaceData.process }}</el-col></el-row>
            </el-main>
          </el-container>
        </el-card>
        <el-container style="height:380px;">
          <el-aside width="40%">
            <el-row style="height:40px"><div class="box-card-label">货代公司</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20"><el-input v-model="orderInfoData.agent" :disabled="orderInfoInputDisable" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货数量</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="11"><el-input-number v-model="orderInfoData.value" :disabled="orderInfoInputDisable" controls-position="right" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货方式</div></el-row>
            <el-row style="margin-left:20px;margin-top:5px;margin-bottom:5px;">
              <el-radio-group v-model="orderInfoData.type" :disabled="orderInfoInputDisable" @change="infoTypeChange">
                <el-radio :label="0">陆运</el-radio>
                <el-radio :label="1">船运</el-radio>
              </el-radio-group>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">船名/陆运车次</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20">
                <el-input v-if="orderInfoData.type === 0" v-model="orderInfoData.wagon" :disabled="orderInfoInputDisable" size="medium" placeholder="请输入内容" />
                <el-select
                  v-if="orderInfoData.type === 1"
                  v-model="orderInfoData.craft"
                  :disabled="orderInfoInputDisable"
                  filterable
                  placeholder="选择船舶"
                >
                  <el-option
                    v-for="item in applyCraftLabel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="60%" style="padding-top:0px;">
            <el-row style="height:40px"><div class="box-card-label">对接人</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="orderInfoData.name" :disabled="orderInfoInputDisable" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">联系电话</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="orderInfoData.phone" :disabled="orderInfoInputDisable" size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">预提货时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="orderInfoData.arrive"
                :disabled="orderInfoInputDisable"
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">合同文件</div></el-row>
            <el-row>
              <el-col :span="18">
                <el-upload
                  ref="orderInfoFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/order/update/portrait"
                  :disabled="orderInfoInputDisable"
                  multiple
                  :limit="1"
                  :file-list="applyOrderFile"
                  :on-preview="handlePictureCardPreview"
                  :on-exceed="handleApplyExceed"
                  :on-success="handleApplySuccess"
                  :on-remove="handleApplyRemove"
                >
                  <el-button v-if="!orderInfoInputDisable" type="success">点击上传</el-button>
                </el-upload>
              </el-col>
              <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img width="80%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-row>
          </el-main>
        </el-container>
        <el-row style="height:40px;margin-left:20px;">
          <el-button type="primary" :disabled="orderInfoInputDisable || isOrderUpdateAble" @click.native.prevent="startUpdateOrder">确认提交</el-button>
          <el-button type="danger" :disabled="orderInfoInputDisable" @click.native.prevent="startDelOrder">删除</el-button>
        </el-row>
        <div v-if="isReviewCardAble" style="margin-left:20px;margin-top:30px;height:200px;width:85%">
          <el-row style="height:30px"><div class="box-card-result-label">审批结果</div></el-row>
          <el-row style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">审批人</div></el-col>
            <el-col :span="8" style="padding-top:2px;color:#409EFF">{{ orderInfoData.approve }}</el-col>
          </el-row>
          <el-row style="height:30px;margin-top:10px;">
            <el-col :span="6"><div class="box-card-result-label" style="padding-left:20px;">修改意见</div></el-col>
            <el-col :span="16">
              <el-input
                v-model="orderInfoData.review"
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

    <el-dialog :visible.sync="dialogVisible" :modal="false"><img width="80%" :src="dialogImageUrl" alt=""></el-dialog>
    <div style="height:400px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
// eslint-disable-next-line no-unused-vars
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import 'element-ui/lib/theme-chalk/base.css'
import { searchUser } from '@/api/user'
import { getEntrustApplyCraftInfo } from '@/api/entrust'
import { getOrderInfo, getOrderList, getSpaceList, getSpaceUpdateList, addOrder, updateOrder, delOrder, processOrder, getSpaceInfo } from '@/api/order'
export default {
  name: 'Entrust',
  rules: { 'vue/no-template-shadow': 'off' },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      applyCardVisible: false,
      applySpaceCardVisible: false,
      orderInfoDrawerVisible: false,
      orderInfoInputDisable: false,
      infoSpaceCardVisible: false,
      applySpaceInfo: [],
      applySpaceLabel: [],
      applyCraftInfo: [],
      applyCraftLabel: [],
      applyOrderFile: [],
      applyOrderData: { account: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '' },
      applySpaceData: { appkey: '', name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0, restore: 0, process: 0.0 },
      searchApplyListInput: '',
      orderListData: [],
      orderInfoData: { appkey: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '', process: false, flag: false, result: false, approve: '', review: '' }
    }
  },
  computed: {
    ...mapGetters({
      token: 'token',
      flag: 'flag',
      userinfo: 'userinfo'
    }),
    permissionResForOrder() { return this.userinfo.grade === 2 },
    permissionResForSearch() { return this.userinfo.grade === 1 },
    isApplyAble() { return (this.applyOrderData.goods === '' || this.applyOrderData.agent === '' || this.applyOrderData.name === '' || this.applyOrderData.arrive === '' || (this.applyOrderData.craft === '' && this.applyOrderData.wagon === '')) },
    isOrderUpdateAble() { return (this.orderInfoData.agent === '' || this.orderInfoData.name === '' || (this.orderInfoData.craft === '' && this.orderInfoData.wagon === '')) },
    isReviewCardAble() { return this.orderInfoData.flag === true && this.orderInfoData.result === false }
  },
  created() {
    this.applyCardVisible = this.permissionResForOrder
    this.initOrderList(this.userinfo.account)
  },
  methods: {
    async initOrderList(account) {
      await getOrderList(account).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes, list } = res
        if (flag === true) {
          this.orderListData = list
        } else { this.orderListData = [] }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    startApply() {
      this.applyCardVisible = true
      getSpaceList(this.userinfo.account).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes, list } = res
        if (flag === true) {
          this.applySpaceInfo = list
          this.applySpaceInfo.forEach((element) => {
            this.applySpaceLabel.push({
              value: element.appkey,
              label: element.name + ' ' + element.restore + '号堆场 余量' + (element.value - element.process)
            })
          })
        }
      })
    },
    rollbackApply() {
      this.applySpaceCardVisible = false
      this.applyCardVisible = false
      this.applySpaceInfo = []
      this.applySpaceLabel = []
      this.applyCraftInfo = []
      this.applyCraftLabel = []
      this.applyOrderFile = []
      this.applyOrderData = { account: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '' }
      this.applySpaceData = { appkey: '', name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0, restore: 0, process: 0.0 }
    },
    applyGoodsChange(appkey) {
      try {
        this.applySpaceInfo.forEach((element) => {
          if (element.appkey === appkey) {
            this.applySpaceData = element
            this.applySpaceCardVisible = true
            throw Error()
          }
        })
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    infoGoodsChange(appkey) {
      try {
        this.applySpaceInfo.forEach((element) => {
          if (element.appkey === appkey) {
            this.applySpaceData = element
            this.infoSpaceCardVisible = true
            throw Error()
          }
        })
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },
    orderRowButtonDisabled(val) { return val === 2 || val === 4 },
    applyTypeChange(value) {
      this.applyOrderData.wagon = ''
      this.applyOrderData.craft = ''
      this.applyCraftInfo = []
      this.applyCraftLabel = []
      if (value === 1) {
        getEntrustApplyCraftInfo(this.userinfo.account).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, mes, list } = res
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
      }
    },
    infoTypeChange(value) {
      this.orderInfoData.wagon = ''
      this.orderInfoData.craft = ''
      this.applyCraftInfo = []
      this.applyCraftLabel = []
      if (value === 1) {
        getEntrustApplyCraftInfo(this.userinfo.account).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, mes, list } = res
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
      }
    },
    handleApplyExceed(files, fileList) {
      Message.warning('材料数量超出限制')
    },
    handleApplySuccess(response, file, fileList) {
      const { flag, mes } = response
      if (flag === false) {
        Message.error(mes)
      } else {
        const index = mes.indexOf('/order/')
        this.applyOrderFile = []
        this.applyOrderFile.push({
          name: mes.substring(index + 7),
          url: mes
        })
        Message.success('上传成功')
      }
    },
    handleApplyRemove(file, fileList) {
      this.applyOrderFile = []
      Message.info('删除成功')
    },
    async orderApplyRequest() {
      this.applyOrderData.account = this.userinfo.account
      if (this.applyOrderFile.length > 0) {
        // eslint-disable-next-line no-unused-vars
        const { name, url } = this.applyOrderFile.pop()
        this.applyOrderData.auth = url
      } else { this.applyOrderData.auth = null }
      if (this.applyOrderData.type === 1) {
        this.applyOrderData.wagon = null
      } else { this.applyOrderData.craft = null }
      this.applyOrderData.craft = this.applyOrderData.craft === '' ? null : this.applyOrderData.craft
      this.applyOrderData.wagon = this.applyOrderData.wagon === '' ? null : this.applyOrderData.wagon
      this.applyOrderData.phone = this.applyOrderData.phone === '' ? null : this.applyOrderData.phone
      this.applyOrderData.auth = this.applyOrderData.auth === '' ? null : this.applyOrderData.auth
      await addOrder(this.applyOrderData).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success(mes)
          this.rollbackApply()
        } else { Message.warning(mes) }
        this.initOrderList(this.userinfo.account)
      })
    },
    async searchOrderList(account) {
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
      if (info != null) { this.initOrderList(info) }
    },
    orderTypeType(type) { return type === 0 ? 'success' : 'primary' },
    orderTypeText(type) { return type === 0 ? '货运' : '船运' },
    orderStatusType(val) {
      if (val === 1) { return 'info' }
      if (val === 2) { return 'warning' }
      if (val === 3) { return 'danger' }
      if (val === 4) { return 'success' }
    },
    orderStatusText(val) {
      if (val === 1) { return '等待审批' }
      if (val === 2) { return '审批中' }
      if (val === 3) { return '未通过' }
      if (val === 4) { return '审批通过' }
    },
    orderProcessType(process) { return process === true ? 'success' : 'primary' },
    orderProcessText(process) { return process === true ? '已发货' : '未发货' },
    async startOrderInfo(appkey, position) {
      if (position === 1) { this.orderInfoInputDisable = true }
      await getOrderInfo(appkey).then((res) => {
        this.orderInfoData = res
        if (this.orderInfoData.type === 1) {
          const craft = this.orderInfoData.craft
          this.infoTypeChange(1)
          this.orderInfoData.craft = craft
          this.applyOrderFile = []
          if (this.orderInfoData.auth != null) {
            const index = this.orderInfoData.auth.indexOf('/order/')
            const fileName = this.orderInfoData.auth.substring(index + 7)
            this.applyOrderFile.push({
              name: fileName,
              url: this.orderInfoData.auth
            })
          }
        }
        const data = {
          account: this.userinfo.account,
          appkey: this.orderInfoData.goods,
          value: this.orderInfoData.value
        }
        getSpaceUpdateList(data).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, mes, list } = res
          if (flag === true) {
            this.applySpaceInfo = list
            this.applySpaceInfo.forEach((element) => {
              this.applySpaceLabel.push({
                value: element.appkey,
                label: element.name + ' ' + element.restore + '号堆场 余量' + (element.value - element.process)
              })
            })
          }
        })
        getSpaceInfo(this.orderInfoData.goods).then((res) => {
          this.applySpaceData = res
        })
      })
      this.orderInfoDrawerVisible = true
    },
    handleClose() {
      this.orderInfoInputDisable = false
      this.orderInfoDrawerVisible = false
      this.infoSpaceCardVisible = false
      this.orderInfoData = []
      this.applySpaceInfo = []
      this.applySpaceLabel = []
      this.rollbackApply()
    },
    async startUpdateOrder() {
      let auth = null
      if (this.applyOrderFile.length > 0) {
        // eslint-disable-next-line no-unused-vars
        const { name, url } = this.applyOrderFile.pop()
        auth = url
      }
      const data = {
        appkey: this.orderInfoData.appkey,
        agent: this.orderInfoData.agent,
        goods: this.orderInfoData.goods,
        value: this.orderInfoData.value,
        type: this.orderInfoData.type,
        craft: this.orderInfoData.type === 1 ? this.orderInfoData.craft : null,
        wagon: this.orderInfoData.type === 0 ? this.orderInfoData.wagon : null,
        name: this.orderInfoData.name,
        phone: this.orderInfoData.phone === '' ? null : this.orderInfoData.phone,
        arrive: this.orderInfoData.arrive,
        auth: auth
      }
      await updateOrder(data).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success(mes)
          this.handleClose()
        } else { Message.warning(mes) }
      })
      await this.initOrderList(this.userinfo.account)
    },
    async startDelOrder() {
      await delOrder(this.orderInfoData.appkey).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success(mes)
          this.handleClose()
        } else { Message.warning(mes) }
      })
      await this.initOrderList(this.userinfo.account)
    },
    async startOrderProcess(appkey) {
      await processOrder(appkey).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success(mes)
          this.handleClose()
        } else { Message.warning(mes) }
      })
      await this.initOrderList(this.userinfo.account)
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
.order-container {}
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
