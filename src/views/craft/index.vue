<template>
  <div class="craft-container">
    <el-card class="box-card-container" style="height:140px;">
      <span class="box-card-title">已绑定船舶列表</span>
      <el-row>
        <el-input
          v-model="craftInput"
          class="input-with-select"
          placeholder="搜索用户"
          :disabled="permissionRes"
        ><el-button slot="append" icon="el-icon-search" @click.native.prevent="craftAccountSearch(craftInput)" /></el-input>
      </el-row>
    </el-card>
    <el-collapse-transition>
      <el-card v-if="craftVisible" class="box-card-container-switch" style="height:600px;" shadow="hover">
        <span class="box-card-title">{{ craftUser.account }}/{{ craftUser.name }}</span>
        <div style="padding-top:15px;padding-left:20px;">
          <el-table
            :data="tableData"
            :show-overflow-tooltip="true"
            style="width: 95%"
            height="500"
            empty-text="暂无绑定船舶信息"
            @selection-change="handleSelectionChange"
          >
            <el-table-column prop="name" label="船舶信息" width="250">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>船名: {{ scope.row.name }}</p>
                  <p>呼号: {{ scope.row.letter }}</p>
                  <p>IMO: {{ scope.row.imo }}</p>
                  <p>MMSI: {{ scope.row.mmsi }}</p>
                  <div slot="reference" style="width:100%;"><el-tag>{{ scope.row.name }}</el-tag></div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              width="100"
              :filters="craftTypeOptions"
              :filter-method="craftTypeFilter"
              filter-placement="bottom-end"
              align="center"
            />
            <el-table-column
              prop="status"
              label="状态"
              width="100"
              :filters="craftStatusOptions"
              :filter-method="craftStatusFilter"
              filter-placement="bottom-end"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="craftStatusColor(scope.row.status)"
                  disable-transitions
                >{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="" width="350">
              <template slot-scope="scope">
                <el-radio-group
                  v-model="scope.row.status"
                  size="small"
                  @change="changeCraftStatus($event, scope.row.name)"
                >
                  <el-radio-button label="在港就绪" />
                  <el-radio-button label="在港作业" />
                  <el-radio-button label="离港" />
                  <el-radio-button label="维修" />
                  <el-radio-button label="故障" />
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  plain
                  @click="craftDelete(scope.row.name)"
                >解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-collapse-transition>
    <el-card class="box-card-container" style="height:140px;">
      <span class="box-card-title">AIS查询</span>
      <el-row>
        <el-autocomplete
          v-model="input"
          class="input-with-select"
          :fetch-suggestions="querySearch"
          placeholder="搜索船舶"
          :trigger-on-focus="false"
          @select="handleSelect"
        ><el-button slot="append" icon="el-icon-search" /></el-autocomplete>
      </el-row>
    </el-card>
    <el-collapse-transition>
      <el-card v-if="isShipCardShowed" class="box-card-container-switch" style="height:620px;" shadow="hover">
        <el-container style="height:450px;">
          <el-aside class="box-card-aside" style="width:40%;">
            <el-card class="box-card-ship">
              <el-row>
                <el-col :span="22"><div class="box-card-label-ship">{{ shipinfo.name }}</div></el-col>
                <el-tooltip effect="light" :content="shipStatusText" placement="top-start"><el-col :span="2" style="padding-top:1px;"><svg-icon :icon-class="shipIconSign" /></el-col></el-tooltip>
              </el-row>
              <el-container style="height:150px;">
                <el-aside style="width:45%;"><el-avatar shape="square" :size="130" fit="contain" :src="shipinfo.portrait" class="box-card-avatar-ship" /></el-aside>
                <el-main style="width:55%;padding-left:2px;">
                  <el-row><el-col :span="8" class="box-card-item-ship">呼号:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ shipinfo.letter }}</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">IMO:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ shipinfo.imo }}</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">MMSI:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ shipinfo.mmsi }}</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">类型:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ shipinfo.type }}</el-col></el-row>
                </el-main>
              </el-container>
              <el-container style="height:210px;padding-top:5px;">
                <el-aside style="width:45%;padding-left:10px;">
                  <el-row><el-col :span="8" class="box-card-item-ship">船长:</el-col><el-col :span="12" style="font-size:15px;padding-left:12px;">{{ shipinfo.length }}米</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">船宽:</el-col><el-col :span="12" style="font-size:15px;padding-left:12px;">{{ shipinfo.width }}米</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">吃水:</el-col><el-col :span="12" style="font-size:15px;padding-left:12px;">{{ shipinfo.draft }}米</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="9" class="box-card-item-ship">航首向:</el-col><el-col :span="12" style="font-size:15px;padding-left:4px;">{{ shipinfo.head }}度</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="9" class="box-card-item-ship">航迹向:</el-col><el-col :span="12" style="font-size:15px;padding-left:4px;">{{ shipinfo.track }}度</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">航速:</el-col><el-col :span="12" style="font-size:15px;padding-left:10px;">{{ shipinfo.speed }}节</el-col></el-row>
                </el-aside>
                <el-main style="width:55%;padding-top:0px;padding-left:0px;">
                  <el-row><el-col :span="9" class="box-card-item-ship">目的地:</el-col><el-tooltip effect="light" :content="shipinfo.destination" placement="top-start"><el-col :span="14" style="font-size:15px;">{{ simpleDestination }}</el-col></el-tooltip></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="10" class="box-card-item-ship">预到时间:</el-col><el-col :span="14" style="font-size:15px;">{{ shipinfo.arrive }}</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="10" class="box-card-item-ship">更新时间:</el-col><el-col :span="14" style="font-size:15px;">{{ shipinfo.refresh }}</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">经度:</el-col><el-col :span="12" style="font-size:15px;padding-left:2px;">{{ shipinfo.longitude.toString().substring(0,9) }}</el-col></el-row>
                  <el-row style="padding-top:10px;"><el-col :span="8" class="box-card-item-ship">纬度:</el-col><el-col :span="12" style="font-size:15px;padding-left:2px;">{{ shipinfo.latitude.toString().substring(0,9) }}</el-col></el-row>
                </el-main>
              </el-container>
            </el-card>
          </el-aside>
          <el-main style="width:60%">
            <baidu-map class="bm-view" :center="center" :scroll-wheel-zoom="true" :zoom="zoom" @ready="handler">
              <bm-marker :position="center" :dragging="false"><bm-label :content="shipinfo.name" :label-style="{color: 'red', fontSize : '12px'}" :offset="{width: -35, height: 30}" /></bm-marker>
            </baidu-map>
          </el-main>
        </el-container>
        <el-row v-if="shipConfirmInfo.flag" class="box-confirm-border" style="background-color: #CCFFCC">
          <el-col :span="1" style="padding-top: 13px;padding-left:10px;"><svg-icon icon-class="ship_success" /></el-col>
          <el-col :span="22"><div class="box-confirm-text" style="color: limegreen">{{ shipConfirmInfo.mes }}</div></el-col>
        </el-row>
        <el-row v-if="!shipConfirmInfo.flag" class="box-confirm-border" style="background-color: #FFCCCC">
          <el-col :span="1" style="padding-top: 13px;padding-left:10px;"><svg-icon icon-class="ship_error" /></el-col>
          <el-col :span="22"><div class="box-confirm-text" style="color: orangered">{{ shipConfirmInfo.mes }}</div></el-col>
        </el-row>
        <el-row style="height:40px;margin-left:20px;">
          <el-button type="primary" :disabled="!shipConfirmInfo.flag" @click.native.prevent="bindShip">绑定该船</el-button>
          <el-button type="success" icon="el-icon-refresh" @click.native.prevent="openShipRefresh">刷新数据</el-button>
        </el-row>
      </el-card>
    </el-collapse-transition>
    <div style="height:400px;" />

    <el-drawer
      title="动态数据更新"
      :visible.sync="shipRefreshVisible"
      :before-close="handleClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">动态数据更新</el-row>
      <el-container style="height:450px;">
        <el-aside style="width:45%;padding-top:1px;">
          <el-row style="height:40px"><div class="box-card-label">船名</div></el-row>
          <el-row style="height:40px"><el-col :span="20" style="padding-left:20px"><el-input v-model="refreshInfo.name" :disabled="true" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">航首向(度)</div></el-row>
          <el-row style="height:40px"><el-col :span="20" style="padding-left:20px"><el-input v-model="refreshInfo.head" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">航迹向(度)</div></el-row>
          <el-row style="height:40px"><el-col :span="20" style="padding-left:20px"><el-input v-model="refreshInfo.track" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">航速(节)</div></el-row>
          <el-row style="height:40px"><el-col :span="20" style="padding-left:20px"><el-input v-model="refreshInfo.speed" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">预到时间</div></el-row>
          <el-row style="padding-left:20px;">
            <el-date-picker
              v-model="refreshInfo.arrive"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-row>
        </el-aside>
        <el-main style="width:55%;padding-top:0px;margin-top:0px;">
          <el-row style="height:40px"><div class="box-card-label">目的地</div></el-row>
          <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="refreshInfo.destination" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">经度</div></el-row>
          <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="refreshInfo.longitude" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">纬度</div></el-row>
          <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="refreshInfo.latitude" size="medium" /></el-col></el-row>
          <el-row style="height:40px"><div class="box-card-label">状态</div></el-row>
          <el-row style="padding-left:20px;">
            <el-select v-model="refreshInfo.status" placeholder="请选择" @change="shipRefreshAccess($event)">
              <el-option
                v-for="item in shipStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-row>
        </el-main>
      </el-container>
      <el-row style="height:40px;margin-left:20px;">
        <el-button type="primary" :disabled="shipRefreshAble" @click.native.prevent="refreshShipInfo">提交更新</el-button>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getKey, getOneByName, updateOneByName, getCraft, confirmShip, delCraft, getCraftPre, bindShipToCraft, updateBatch } from '@/api/craft'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/base.css'
// eslint-disable-next-line no-unused-vars
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import user from '@/store/modules/user'
import { searchUser } from '@/api/user'

export default {
  name: 'Craft',
  rules: { 'vue/no-template-shadow': 'off' },
  data() {
    return {
      input: '',
      craftInput: '',
      shipinfo: {
        id: 0,
        name: '', letter: '', imo: '', mmsi: '', type: '',
        length: 0.0, width: 0.0, draft: 0.0, portrait: '',
        status: 'none', head: 0.0, track: 0.0, speed: 0.0,
        latitude: 0.0, longitude: 0.0, destination: '', arrive: '', refresh: ''
      },
      center: {
        lng: 0.0,
        lat: 0.0
      },
      zoom: 0,
      refreshInfo: {
        name: '',
        head: 0.0, track: 0.0, speed: 0.0,
        latitude: 0.0, longitude: 0.0, destination: '', arrive: '', status: 0
      },
      shipRefreshVisible: false,
      shipRefreshAble: true,
      shipStatusOptions: [
        { value: 1, label: '在港就绪' },
        { value: 2, label: '在港作业' },
        { value: 3, label: '离港' },
        { value: 4, label: '维修' },
        { value: 5, label: '故障' }
      ],
      craftTypeOptions: [
        { text: '散货船', value: '散货船' },
        { text: '集装箱船', value: '集装箱船' },
        { text: '滚装船', value: '滚装船' },
        { text: '载驳船', value: '载驳船' },
        { text: '冷藏船', value: '冷藏船' },
        { text: '矿油船', value: '矿油船' },
        { text: '客货船', value: '客货船' },
        { text: '特种船', value: '特种船' }
      ],
      craftStatusOptions: [
        { text: '在港就绪', value: '在港就绪' },
        { text: '在港作业', value: '在港作业' },
        { text: '离港', value: '离港' },
        { text: '维修', value: '维修' },
        { text: '故障', value: '故障' }
      ],
      shipConfirmInfo: {
        flag: true,
        mes: ''
      },
      tableData: [],
      multipleSelection: [],
      craftVisible: false,
      craftUser: {
        account: '',
        name: ''
      }
    }
  },
  computed: {
    user() {
      return user
    },
    ...mapGetters({
      token: 'token',
      flag: 'flag',
      userinfo: 'userinfo'
    }),
    isShipCardShowed() { return !(this.shipinfo.id === 0) },
    simpleDestination() {
      if (this.shipinfo.destination.length >= 8) { return this.shipinfo.destination.substring(0, 8) + '...' }
      return this.shipinfo.destination
    },
    shipIconSign() {
      if (this.shipinfo.status === '在港就绪') { return 'ship_success' }
      if (this.shipinfo.status === '在港作业' || this.shipinfo.status === '离港') { return 'ship_busy' }
      if (this.shipinfo.status === '维修' || this.shipinfo.status === '故障') { return 'ship_error' }
      return 'ship_none'
    },
    shipStatusText() { return '状态:' + this.shipinfo.status },
    permissionRes() { return this.userinfo.grade === 1 }
  },
  created() {
    this.craftUser.account = this.userinfo.account
    this.craftUser.name = this.userinfo.name
    this.getCraftInfo(this.craftUser.account)
  },
  methods: {
    craftStatusColor(val) {
      if (val === '在港就绪') { return 'success' }
      if (val === '在港作业' || val === '离港') { return 'warning' }
      if (val === '维修' || val === '故障') { return 'danger' }
      return 'info'
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getCraftInfo(account) {
      getCraft(account).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.tableData = list
        } else { this.tableData = [] }
        this.craftVisible = true
      })
    },
    querySearch(queryString, cb) {
      getKey(queryString).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        cb(list)
      })
    },
    getShipInfo(input) {
      getOneByName(input).then((res) => {
        this.shipinfo = res
      })
      const data = {
        account: this.userinfo.account,
        name: this.input
      }
      confirmShip(data).then((res) => {
        const { flag, mes } = res
        this.shipConfirmInfo.flag = flag
        this.shipConfirmInfo.mes = mes
      })
      this.handlePosition()
    },
    handleSelect(item) {
      const index = this.input.indexOf('----->')
      this.input = this.input.substring(0, index)
      this.getShipInfo(this.input)
      console.log(item)
    },
    handler({ BMap, map }) {
      console.log(BMap, map)
      this.handlePosition()
    },
    handlePosition() {
      this.center.lng = this.shipinfo.longitude
      this.center.lat = this.shipinfo.latitude
      this.zoom = 7
    },
    openShipRefresh() {
      this.refreshInfo = {
        name: this.shipinfo.name,
        head: this.shipinfo.head, track: this.shipinfo.track, speed: this.shipinfo.speed,
        latitude: this.shipinfo.latitude, longitude: this.shipinfo.longitude, destination: this.shipinfo.destination, arrive: this.shipinfo.arrive
      }
      this.shipRefreshVisible = true
    },
    bindShip() {
      const bindInfo = {
        account: this.userinfo.account,
        name: this.shipinfo.name
      }
      bindShipToCraft(bindInfo).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          this.getShipInfo(this.input)
          this.getCraftInfo(this.craftUser.account)
          Message.success(mes)
        } else { Message.warning(mes) }
      })
    },
    refreshShipInfo() {
      updateOneByName(this.refreshInfo).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes } = res
        if (flag === true) {
          this.handleClose()
          this.getShipInfo(this.input)
        }
      })
    },
    handleClose() {
      this.refreshInfo = {
        name: this.shipinfo.name,
        head: this.shipinfo.head, track: this.shipinfo.track, speed: this.shipinfo.speed,
        latitude: this.shipinfo.latitude, longitude: this.shipinfo.longitude, destination: this.shipinfo.destination, arrive: this.shipinfo.arrive
      }
      this.shipRefreshVisible = false
      this.shipRefreshAble = true
    },
    shipRefreshAccess(value) {
      this.shipRefreshAble = false
      console.log(value)
    },
    craftTypeFilter(value, row) {
      return row.type === value
    },
    craftStatusFilter(value, row) {
      return row.status === value
    },
    craftDelete(name) {
      delCraft(name).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          this.getCraftInfo(this.craftUser.account)
          if (name === this.input) { this.getShipInfo(this.input) }
          Message.success(mes)
        } else { Message.error(mes) }
      })
    },
    async craftAccountSearch(input) {
      if (input === '') {
        this.getCraftInfo(this.userinfo.account)
        this.craftUser.account = this.userinfo.account
        this.craftUser.name = this.userinfo.name
      } else {
        await searchUser(input).then((res) => {
          const { flag, grade } = res
          if (flag === false) {
            Message.info('未查找到指定的用户')
          } else {
            if (grade === 2) {
              Message.info('该用户为审批用户')
            } else {
              getCraftPre(input).then((res) => {
                const { flag, account, name } = res
                if (flag === false) {
                  Message.info('未查找到指定的用户')
                } else {
                  this.craftUser.account = account
                  this.craftUser.name = name
                  this.getCraftInfo(this.craftUser.account)
                }
              })
            }
          }
        })
      }
    },
    async changeCraftStatus(value, row) {
      const data = {
        name: [row],
        status: value
      }
      await updateBatch(data)
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
.craft-container {}
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
.box-card-ship {
  margin-top: 15px;
  height: 400px;
  width: 100%;
}
.box-card-avatar-ship {
  margin-top: 10px;
}
.bm-view {
  margin-top: 5px;
  width: 100%;
  height: 400px;
}
.box-confirm-border {
  height: 45px;
  width: 50%;
  margin-left:20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.box-confirm-text {
  padding-top: 13px;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 550;
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
