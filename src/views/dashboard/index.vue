<template>
  <div class="dashboard-container">
    <el-container>
      <el-aside width="45%">
        <el-card class="box-card-container" style="height:400px;">
          <span class="box-card-title">今日工单提交数</span>
          <el-row style="margin:0 0 0 0;padding:0 0 0 0;">
            <el-col :span="2" class="box-card-title-switch">
              {{ logTableData.record.apply }}
            </el-col>
            <el-col :span="22" style="margin-top:20px;">
              <ve-pie :data="applyChartData" :settings="applyChartSettings" />
            </el-col>
          </el-row>
        </el-card>
      </el-aside>
      <el-main width="50%">
        <el-card class="box-card-container-switch" style="height:400px;">
          <span class="box-card-title">今日工单审批数</span>
          <el-row style="margin:0 0 0 0;padding:0 0 0 0;">
            <el-col :span="2" class="box-card-title-switch">
              {{ logTableData.record.apply }}
            </el-col>
            <el-col :span="22" style="margin-top:20px;">
              <ve-pie :data="approveChartData" :settings="approveChartSettings" />
            </el-col>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
    <el-card class="box-card-container" style="height:450px;">
      <span class="box-card-title">港口堆场负载</span>
      <el-row :span="18" style="margin-left:20px;margin-top:20px;">
        <ve-histogram :data="restoreChartData" :settings="restoreChartSettings" />
      </el-row>
    </el-card>
    <el-card class="box-card-container" style="height:450px;">
      <span class="box-card-title">操作日志</span>
      <el-table
        :data="logTableData.log"
        :show-overflow-tooltip="true"
        style="width:90%;margin-top:20px;margin-left:20px;"
        height="350"
        empty-text="暂无记录的用户操作"
      >
        <el-table-column prop="daytime" label="操作时间" width="200" align="center" sortable />
        <el-table-column prop="name" label="用户名" width="200" align="center" />
        <el-table-column prop="description" label="操作记录" width="400" align="center" />
      </el-table>
    </el-card>
    <div style="height:400px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLogFullBundle } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      logTableData: {
        flag: false,
        record: {
          flag: false,
          apply: 0,
          license: 0,
          entrust: 0,
          order: 0,
          approval: 0,
          success: 0,
          back: 0
        },
        restore: [],
        log: []
      },
      applyChartSettings: {
        dimension: '工单类型',
        metrics: '提交次数'
      },
      applyChartData: {
        columns: ['工单类型', '提交次数'],
        rows: []
      },
      approveChartSettings: {
        dimension: '审批结果',
        metrics: '审批次数'
      },
      approveChartData: {
        columns: ['审批结果', '审批次数'],
        rows: []
      },
      restoreChartSettings: {
        stack: {
          '容量': ['额定容量', '已用容量']
        }
      },
      restoreChartData: {
        columns: ['港口堆场号', '额定容量', '已用容量'],
        rows: []
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'token',
      flag: 'flag',
      userinfo: 'userinfo'
    })
  },
  created() {
    this.getLogInfo()
  },
  methods: {
    async getLogInfo() {
      await getLogFullBundle().then((res) => {
        this.logTableData = res
        this.applyChartData.rows.push(
          { '工单类型': '用户许可证', '提交次数': this.logTableData.record.license },
          { '工单类型': '装卸委托书', '提交次数': this.logTableData.record.entrust },
          { '工单类型': '发货指令', '提交次数': this.logTableData.record.order }
        )
        this.approveChartData.rows.push(
          { '审批结果': '通过', '审批次数': this.logTableData.record.success },
          { '审批结果': '打回', '审批次数': this.logTableData.record.back }
        )
        this.logTableData.restore.forEach((elements) => {
          this.restoreChartData.rows.push({
            '港口堆场号': elements.id + '号堆场',
            '额定容量': elements.volume,
            '已用容量': elements.volume - elements.vleft
          })
        })
      })
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
.dashboard-container {}
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
  width: 75%;
  background-color: white;
  margin-top: 20px;
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
.box-card-title-switch {
  font-family: title-regular;
  font-size:25px;
  padding-left:20px;
  padding-top:20px;
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

