<template>
  <div class="approve-container">
    <el-card class="box-card-container" style="height:140px;">
      <span class="box-card-title">待审批工单列表</span>
      <el-row>
        <el-input
          v-model="approveInput"
          class="input-with-select"
          placeholder="搜索用户/编号"
          :disabled="permissionResForSearch"
        ><el-button slot="append" icon="el-icon-search" @click.native.prevent="searchKeyWordApprove" /></el-input>
      </el-row>
    </el-card>
    <el-card class="box-card-container-switch" style="height:500px;" shadow="hover">
      <div style="padding-left:20px;">
        <el-table
          :data="freeTableData"
          :show-overflow-tooltip="true"
          style="width: 95%"
          height="400"
          empty-text="暂无可审批的工单信息"
        >
          <el-table-column prop="appkey" label="工单编号" width="160" align="center" />
          <el-table-column
            prop="type"
            label="工单类型"
            width="150"
            :filters="approveTypeOptions"
            :filter-method="approveTypeFilter"
            filter-placement="bottom-end"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="approveTypeColor(scope.row.type)"
              >{{ approveTypeText(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="apply" label="申请用户" width="150" align="center" />
          <el-table-column prop="appday" label="申请时间" width="200" align="center" />
          <el-table-column label="">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                plain
                :disabled="permissionResForApprove"
                @click="approveReserve(scope.row.appkey)"
              >预约</el-button>
              <el-button
                size="small"
                type="primary"
                plain
                :disabled="permissionResForApprove"
                @click="approveDrawerShow(scope.row.appkey,scope.row.type,1)"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card-container" style="height:600px;">
      <span class="box-card-title">已预约工单列表</span>
      <div style="padding-left:20px;margin-top:20px;">
        <el-table
          :data="reserveTableData"
          :show-overflow-tooltip="true"
          style="width: 95%"
          height="500"
          empty-text="暂无已预约的工单信息"
        >
          <el-table-column prop="appkey" label="工单编号" width="150" align="center" />
          <el-table-column
            prop="type"
            label="工单类型"
            width="150"
            :filters="approveTypeOptions"
            :filter-method="approveTypeFilter"
            filter-placement="bottom-end"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="approveTypeColor(scope.row.type)"
              >{{ approveTypeText(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="apply" label="申请用户" width="150" align="center" />
          <el-table-column prop="appday" label="申请时间" width="200" align="center" />
          <el-table-column label="">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                plain
                :disabled="permissionResForApprove"
                @click="approveDrawerShow(scope.row.appkey, scope.row.type, 2)"
              >审批</el-button>
              <el-button
                size="small"
                type="danger"
                plain
                :disabled="permissionResForApprove"
                @click="approveReserveReset(scope.row.appkey)"
              >取消预约</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="box-card-container" style="height:600px;">
      <span class="box-card-title">审批记录</span>
      <div style="padding-left:20px;margin-top:20px;">
        <el-table
          :data="logTableData"
          :show-overflow-tooltip="true"
          style="width: 95%"
          height="500"
          empty-text="暂无已审批的工单信息"
        >
          <el-table-column prop="appkey" label="工单编号" width="150" align="center" />
          <el-table-column
            prop="type"
            label="工单类型"
            width="150"
            :filters="approveTypeOptions"
            :filter-method="approveTypeFilter"
            filter-placement="bottom-end"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                :type="approveTypeColor(scope.row.type)"
              >{{ approveTypeText(scope.row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="审批结果" width="100" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="approveResultColor(scope.row.result)"
              >{{ approveResultText(scope.row.result) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="apply" label="申请用户" width="100" align="center" />
          <el-table-column prop="appday" label="申请时间" width="160" align="center" />
          <el-table-column prop="comday" label="审批时间" width="160" align="center" />
          <el-table-column label="">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                plain
                :disabled="permissionResForApprove"
                @click="approveDrawerShow(scope.row.appkey,scope.row.type,3)"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div style="height:400px;" />

    <el-drawer
      title="许可证工单信息"
      :visible.sync="typeLicenseInfoDrawerVisible"
      :before-close="handleTypeLicenseClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单信息</el-row>
      <div style="height:300px">
        <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseInfo.account" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">所属公司</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseInfo.company" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">真实姓名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseInfo.name" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:20px;"><div class="box-card-label-change">证明材料</div></el-row>
        <el-row>
          <el-upload
            ref="uploadLicense"
            class="box-card-avatar"
            accept=".jpeg,.png,.jpg"
            action="http://localhost:11088/license/update/portrait"
            disabled
            multiple
            :limit="1"
            :file-list="typeLicenseFile"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
          ><i class="el-icon-picture-outline" /></el-upload>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="许可证工单审批"
      :visible.sync="typeLicenseApproveDrawerVisible"
      :before-close="handleTypeLicenseClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单审批</el-row>
      <div style="height:300px">
        <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseInfo.account" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">所属公司</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseInfo.company" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">真实姓名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseInfo.name" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:20px;"><div class="box-card-label-change">证明材料</div></el-row>
        <el-row>
          <el-upload
            ref="uploadLicense"
            class="box-card-avatar"
            accept=".jpeg,.png,.jpg"
            action="http://localhost:11088/license/update/portrait"
            disabled
            multiple
            :limit="1"
            :file-list="typeLicenseFile"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
          ><i class="el-icon-picture-outline" /></el-upload>
        </el-row>
        <el-row style="height:15px;" />
        <el-row style="height:30px"><div class="box-card-label-change">审批结果</div></el-row>
        <el-row style="height:40px">
          <el-col :span="12" style="padding-left:20px;padding-top:5px;">
            <el-radio-group v-model="approveResult.flag">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">打回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">审批意见</div></el-row>
        <el-row style="height:80px">
          <el-col :span="18" style="padding-left:20px">
            <el-input
              v-model="approveResult.review"
              type="textarea"
              :disabled="approveResult.flag"
              :rows="3"
              :maxlength="100"
              :show-word-limit="true"
              placeholder="请输入内容"
            />
          </el-col>
        </el-row>
        <el-row style="height:40px;margin-left:20px;margin-top:20px;">
          <el-button type="primary" @click.native.prevent="startApproveDeal">确认提交</el-button>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="许可证工单记录"
      :visible.sync="typeLicenseLogDrawerVisible"
      :before-close="handleTypeLicenseClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单记录</el-row>
      <div style="height:300px">
        <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseLog.account" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">所属公司</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseLog.company" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">真实姓名</div></el-row>
        <el-row style="height:40px"><el-col :span="12" style="padding-left:20px"><el-input v-model="typeLicenseLog.name" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;margin-top:20px;"><div class="box-card-label-change">证明材料</div></el-row>
        <el-row>
          <el-upload
            ref="uploadLicense"
            class="box-card-avatar"
            accept=".jpeg,.png,.jpg"
            action="http://localhost:11088/license/update/portrait"
            disabled
            multiple
            :limit="1"
            :file-list="typeLicenseFile"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
          ><i class="el-icon-picture-outline" /></el-upload>
        </el-row>
        <el-row style="height:15px;" />
        <el-row style="height:30px"><div class="box-card-label-change">审批结果</div></el-row>
        <el-row style="height:40px">
          <el-col :span="12" style="padding-left:20px;padding-top:5px;">
            <el-radio-group v-model="typeLicenseLog.result" disabled>
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">打回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">审批意见</div></el-row>
        <el-row style="height:80px">
          <el-col :span="18" style="padding-left:20px">
            <el-input
              v-model="typeLicenseLog.review"
              type="textarea"
              disabled
              :rows="3"
              :maxlength="100"
              :show-word-limit="true"
            />
          </el-col>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="装卸委托书工单信息"
      :visible.sync="typeEntrustInfoDrawerVisible"
      :before-close="handleTypeEntrustClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单信息</el-row>
      <div style="height:300px">
        <el-container>
          <el-aside width="50%">
            <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.account" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">进港船舶</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.craft" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">预进港时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="typeEntrustInfo.arrive"
                disabled
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.name" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">合同文件</div></el-row>
            <el-row>
              <el-col :span="18">
                <el-upload
                  ref="typeEntrustFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/entrust/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="typeEntrustFile"
                  :on-preview="handlePictureCardPreview"
                />
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="50%" style="padding: 0 0 0 0;">
            <el-row style="height:30px;"><div class="box-card-label-change">货物标志</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.signature" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物包装</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.pack" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:11px;"><div class="box-card-label-change">数量</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustInfo.value" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">净重/T</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustInfo.weight" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">体积/m³</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustInfo.volume" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
          </el-main>
        </el-container>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="装卸委托书工单审批"
      :visible.sync="typeEntrustApproveDrawerVisible"
      :before-close="handleTypeEntrustClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单审批</el-row>
      <div style="height:300px">
        <el-container>
          <el-aside width="50%">
            <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.account" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">进港船舶</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.craft" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">预进港时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="typeEntrustInfo.arrive"
                disabled
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.name" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">合同文件</div></el-row>
            <el-row>
              <el-col :span="18">
                <el-upload
                  ref="typeEntrustFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/entrust/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="typeEntrustFile"
                  :on-preview="handlePictureCardPreview"
                />
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="50%" style="padding: 0 0 0 0;">
            <el-row style="height:30px;"><div class="box-card-label-change">货物标志</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.signature" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物包装</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustInfo.pack" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:11px;"><div class="box-card-label-change">数量</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustInfo.value" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">净重/T</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustInfo.weight" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">体积/m³</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustInfo.volume" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
          </el-main>
        </el-container>
        <el-row style="height:30px;margin-top:40px;"><div class="box-card-label-change">审批结果</div></el-row>
        <el-row style="height:40px">
          <el-col :span="12" style="padding-left:20px;padding-top:5px;">
            <el-radio-group v-model="entrustApproveResult.flag" @input="entrustApproveResultChange">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">打回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">货物分配</div></el-row>
        <el-select v-model="entrustApproveResult.restore" :disabled="entrustApproveResult.flag === false" placeholder="选择堆场" style="margin-left:20px;margin-bottom:20px;">
          <el-option
            v-for="item in approveRestoreOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
        <el-row style="height:30px;"><div class="box-card-label-change">审批意见</div></el-row>
        <el-row style="height:80px">
          <el-col :span="18" style="padding-left:20px">
            <el-input
              v-model="entrustApproveResult.review"
              type="textarea"
              :disabled="entrustApproveResult.flag"
              :rows="3"
              :maxlength="100"
              :show-word-limit="true"
              placeholder="请输入内容"
            />
          </el-col>
        </el-row>
        <el-row style="height:40px;margin-left:20px;margin-top:20px;">
          <el-button type="primary" :disabled="isEntrustDealAble" @click.native.prevent="startEntrustDeal">确认提交</el-button>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="装卸委托书工单记录"
      :visible.sync="typeEntrustLogDrawerVisible"
      :before-close="handleTypeEntrustClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单记录</el-row>
      <div style="height:300px">
        <el-container>
          <el-aside width="50%">
            <el-row style="height:30px"><div class="box-card-label-change">用户名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustLog.account" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">进港船舶</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustLog.craft" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">预进港时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="typeEntrustLog.arrive"
                disabled
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物名</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustLog.name" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">合同文件</div></el-row>
            <el-row>
              <el-col :span="18">
                <el-upload
                  ref="typeEntrustFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/entrust/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="typeEntrustFile"
                  :on-preview="handlePictureCardPreview"
                />
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="50%" style="padding: 0 0 0 0;">
            <el-row style="height:30px;"><div class="box-card-label-change">货物标志</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustLog.signature" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">货物包装</div></el-row>
            <el-row style="height:40px"><el-col :span="18" style="padding-left:20px"><el-input v-model="typeEntrustLog.pack" size="medium" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:11px;"><div class="box-card-label-change">数量</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustLog.value" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">净重/T</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustLog.weight" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
            <el-row style="height:30px;margin-top:10px;"><div class="box-card-label-change">体积/m³</div></el-row>
            <el-row style="height:40px;"><el-col :span="18" style="margin-left:15px;"><el-input-number v-model="typeEntrustLog.volume" size="medium" :precision="2" :step="0.01" disabled /></el-col></el-row>
          </el-main>
        </el-container>
        <el-row style="height:30px;margin-top:40px;"><div class="box-card-label-change">审批结果</div></el-row>
        <el-row style="height:40px">
          <el-col :span="12" style="padding-left:20px;padding-top:5px;">
            <el-radio-group v-model="typeEntrustLog.flag" disabled>
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">打回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">货物分配</div></el-row>
        <el-row style="height:40px;margin-bottom:15px;"><el-col :span="6" style="margin-left:20px;"><el-input v-model="entrustRestoreLog" size="medium" disabled /></el-col></el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">审批意见</div></el-row>
        <el-row style="height:80px">
          <el-col :span="18" style="padding-left:20px">
            <el-input
              v-model="typeEntrustLog.review"
              type="textarea"
              disabled
              :rows="3"
              :maxlength="100"
              :show-word-limit="true"
              placeholder="暂无"
            />
          </el-col>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="发货指令工单信息"
      :visible.sync="typeOrderInfoDrawerVisible"
      :before-close="handleTypeOrderClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单信息</el-row>
      <div style="height:300px">
        <el-row style="height:40px"><div class="box-card-label">用户名</div></el-row>
        <el-row style="height:40px;margin-left:20px;"><el-col :span="8"><el-input v-model="typeOrderInfo.account" disabled size="medium" placeholder="请输入内容" /></el-col></el-row>
        <el-row style="height:40px"><div class="box-card-label">发货货物</div></el-row>
        <el-row style="height:40px;margin-left:20px;"><el-col :span="8"><el-input v-model="typeOrderSpaceInfo.name" disabled size="medium" placeholder="请输入内容" /></el-col></el-row>
        <el-card style="height:165px;margin-left:20px;margin-top:10px;margin-bottom:10px;width:60%">
          <el-container>
            <el-aside width="50%">
              <el-row><el-col :span="12" class="box-card-item-ship">货物名:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.name }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物标志:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.signature }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物包装:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.pack }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="11" class="box-card-item-ship" style="margin-top:7px;">存放地点:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;"><el-tag type="primary">{{ typeOrderSpaceInfo.restore }}号堆场</el-tag></el-col></el-row>
            </el-aside>
            <el-main width="50%" style="margin-top:0px;padding-top:0px;">
              <el-row><el-col :span="12" class="box-card-item-ship">总数量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.value }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总净重:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.weight }}T</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总体积:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.volume }}m³</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">预约量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.process }}</el-col></el-row>
            </el-main>
          </el-container>
        </el-card>
        <el-container style="height:380px;">
          <el-aside width="40%">
            <el-row style="height:40px"><div class="box-card-label">货代公司</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20"><el-input v-model="typeOrderInfo.agent" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货数量</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="11"><el-input-number v-model="typeOrderInfo.value" disabled controls-position="right" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货方式</div></el-row>
            <el-row style="margin-left:20px;margin-top:5px;">
              <el-radio-group v-model="typeOrderInfo.type" disabled>
                <el-radio :label="0">陆运</el-radio>
                <el-radio :label="1">船运</el-radio>
              </el-radio-group>
            </el-row>
            <el-row style="height:40px;margin-top:16px;"><div class="box-card-label">船名/陆运车次</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20">
                <el-input v-if="typeOrderInfo.type === 0" v-model="typeOrderInfo.wagon" disabled size="medium" placeholder="请输入内容" />
                <el-input v-if="typeOrderInfo.type === 1" v-model="typeOrderInfo.craft" disabled size="medium" placeholder="请输入内容" />
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="60%" style="padding-top:0px;">
            <el-row style="height:40px"><div class="box-card-label">对接人</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="typeOrderInfo.name" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">联系电话</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="typeOrderInfo.phone" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">预提货时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="typeOrderInfo.arrive"
                disabled
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
                  ref="orderInfoFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/order/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="typeOrderFile"
                  disable
                  :on-preview="handlePictureCardPreview"
                ></el-upload>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="发货指令工单审批"
      :visible.sync="typeOrderApproveDrawerVisible"
      :before-close="handleTypeOrderClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单审批</el-row>
      <div style="height:300px">
        <el-row style="height:40px"><div class="box-card-label">用户名</div></el-row>
        <el-row style="height:40px;margin-left:20px;"><el-col :span="8"><el-input v-model="typeOrderInfo.account" disabled size="medium" placeholder="请输入内容" /></el-col></el-row>
        <el-row style="height:40px"><div class="box-card-label">发货货物</div></el-row>
        <el-row style="height:40px;margin-left:20px;"><el-col :span="8"><el-input v-model="typeOrderSpaceInfo.name" disabled size="medium" placeholder="请输入内容" /></el-col></el-row>
        <el-card style="height:165px;margin-left:20px;margin-top:10px;margin-bottom:10px;width:60%">
          <el-container>
            <el-aside width="50%">
              <el-row><el-col :span="12" class="box-card-item-ship">货物名:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.name }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物标志:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.signature }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物包装:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.pack }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="11" class="box-card-item-ship" style="margin-top:7px;">存放地点:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;"><el-tag type="primary">{{ typeOrderSpaceInfo.restore }}号堆场</el-tag></el-col></el-row>
            </el-aside>
            <el-main width="50%" style="margin-top:0px;padding-top:0px;">
              <el-row><el-col :span="12" class="box-card-item-ship">总数量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.value }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总净重:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.weight }}T</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">总体积:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.volume }}m³</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">预约量:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.process }}</el-col></el-row>
            </el-main>
          </el-container>
        </el-card>
        <el-container style="height:380px;">
          <el-aside width="40%">
            <el-row style="height:40px"><div class="box-card-label">货代公司</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20"><el-input v-model="typeOrderInfo.agent" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货数量</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="11"><el-input-number v-model="typeOrderInfo.value" disabled controls-position="right" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货方式</div></el-row>
            <el-row style="margin-left:20px;margin-top:5px;">
              <el-radio-group v-model="typeOrderInfo.type" disabled>
                <el-radio :label="0">陆运</el-radio>
                <el-radio :label="1">船运</el-radio>
              </el-radio-group>
            </el-row>
            <el-row style="height:40px;margin-top:16px;"><div class="box-card-label">船名/陆运车次</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20">
                <el-input v-if="typeOrderInfo.type === 0" v-model="typeOrderInfo.wagon" disabled size="medium" placeholder="请输入内容" />
                <el-input v-if="typeOrderInfo.type === 1" v-model="typeOrderInfo.craft" disabled size="medium" placeholder="请输入内容" />
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="60%" style="padding-top:0px;">
            <el-row style="height:40px"><div class="box-card-label">对接人</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="typeOrderInfo.name" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">联系电话</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="typeOrderInfo.phone" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">预提货时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="typeOrderInfo.arrive"
                disabled
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
                  ref="orderInfoFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/order/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="typeOrderFile"
                  disable
                  :on-preview="handlePictureCardPreview"
                ></el-upload>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <el-row style="height:30px;"><div class="box-card-label-change">审批结果</div></el-row>
        <el-row style="height:40px">
          <el-col :span="12" style="padding-left:20px;padding-top:5px;">
            <el-radio-group v-model="orderApproveResult.flag" @input="orderApproveResultChange">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">打回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">审批意见</div></el-row>
        <el-row style="height:80px">
          <el-col :span="18" style="padding-left:20px">
            <el-input
              v-model="orderApproveResult.review"
              type="textarea"
              :disabled="orderApproveResult.flag"
              :rows="3"
              :maxlength="100"
              :show-word-limit="true"
              placeholder="请输入内容"
            />
          </el-col>
        </el-row>
        <el-row style="height:40px;margin-left:20px;margin-top:20px;">
          <el-button type="primary" @click.native.prevent="startOrderDeal">确认提交</el-button>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-drawer
      title="发货指令工单记录"
      :visible.sync="typeOrderLogDrawerVisible"
      :before-close="handleTypeOrderClose"
      :with-header="false"
      :close-on-press-escape="false"
      size="40%"
    >
      <el-row class="box-card-title-drawer">工单记录</el-row>
      <div style="height:300px">
        <el-row style="height:40px"><div class="box-card-label">用户名</div></el-row>
        <el-row style="height:40px;margin-left:20px;"><el-col :span="8"><el-input v-model="typeOrderLog.account" disabled size="medium" placeholder="请输入内容" /></el-col></el-row>
        <el-row style="height:40px"><div class="box-card-label">发货货物</div></el-row>
        <el-row style="height:40px;margin-left:20px;"><el-col :span="8"><el-input v-model="typeOrderSpaceInfo.name" disabled size="medium" placeholder="请输入内容" /></el-col></el-row>
        <el-card style="height:165px;margin-left:20px;margin-top:10px;margin-bottom:10px;width:60%">
          <el-container>
            <el-aside width="50%">
              <el-row><el-col :span="12" class="box-card-item-ship">货物名:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.name }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物标志:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.signature }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="12" class="box-card-item-ship">货物包装:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;">{{ typeOrderSpaceInfo.pack }}</el-col></el-row>
              <el-row style="padding-top:12px;"><el-col :span="11" class="box-card-item-ship" style="margin-top:7px;">存放地点:</el-col><el-col :span="12" style="font-size:15px;padding-left:5px;"><el-tag type="primary">{{ typeOrderSpaceInfo.restore }}号堆场</el-tag></el-col></el-row>
            </el-aside>
          </el-container>
        </el-card>
        <el-container style="height:380px;">
          <el-aside width="40%">
            <el-row style="height:40px"><div class="box-card-label">货代公司</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20"><el-input v-model="typeOrderLog.agent" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货数量</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="11"><el-input-number v-model="typeOrderLog.value" disabled controls-position="right" size="medium" :precision="2" :step="0.01" :min="0.0" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">发货方式</div></el-row>
            <el-row style="margin-left:20px;margin-top:5px;">
              <el-radio-group v-model="typeOrderLog.type" disabled>
                <el-radio :label="0">陆运</el-radio>
                <el-radio :label="1">船运</el-radio>
              </el-radio-group>
            </el-row>
            <el-row style="height:40px;margin-top:16px;"><div class="box-card-label">船名/陆运车次</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="20">
                <el-input v-if="typeOrderLog.type === 0" v-model="typeOrderLog.wagon" disabled size="medium" placeholder="请输入内容" />
                <el-input v-if="typeOrderLog.type === 1" v-model="typeOrderLog.craft" disabled size="medium" placeholder="请输入内容" />
              </el-col>
            </el-row>
          </el-aside>
          <el-main width="60%" style="padding-top:0px;">
            <el-row style="height:40px"><div class="box-card-label">对接人</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="typeOrderLog.name" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">联系电话</div></el-row>
            <el-row style="margin-left:20px;">
              <el-col :span="15"><el-input v-model="typeOrderLog.phone" disabled size="medium" placeholder="请输入内容" /></el-col>
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">预提货时间</div></el-row>
            <el-row style="padding-left:20px;">
              <el-date-picker
                v-model="typeOrderLog.arrive"
                disabled
                type="datetime"
                placeholder="选择日期时间"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-row>
            <el-row style="height:40px"><div class="box-card-label">合同文件</div></el-row>
            <el-row>
              <el-col :span="16">
                <el-upload
                  ref="orderInfoFile"
                  class="box-card-avatar"
                  action="http://localhost:11088/order/update/portrait"
                  multiple
                  :limit="1"
                  :file-list="typeOrderFile"
                  disable
                  :on-preview="handlePictureCardPreview"
                ></el-upload>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
        <el-row style="height:30px;"><div class="box-card-label-change">审批结果</div></el-row>
        <el-row style="height:40px">
          <el-col :span="12" style="padding-left:20px;padding-top:5px;">
            <el-radio-group v-model="typeOrderLog.result" disabled @input="orderApproveResultChange">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">打回</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="height:30px;"><div class="box-card-label-change">审批意见</div></el-row>
        <el-row style="height:80px">
          <el-col :span="18" style="padding-left:20px">
            <el-input
              v-model="typeOrderLog.review"
              type="textarea"
              disabled
              :rows="3"
              :maxlength="100"
              :show-word-limit="true"
              placeholder="请输入内容"
            />
          </el-col>
        </el-row>
        <div style="height:100px;" />
      </div>
    </el-drawer>

    <el-dialog :visible.sync="dialogVisible" :modal="false"><img width="80%" :src="dialogImageUrl" alt=""></el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/base.css'
import {
  getFreeList,
  getKeyList,
  getReserveList,
  reserveOne,
  reserveReset,
  dealOne,
  getLicense,
  getLogList,
  getLicenseLog,
  getEntrust,
  getEntrustLog,
  getRestoreList,
  dealEntrustApproval,
  getOrder,
  getOrderLog,
  dealOrderApproval,
  getSpaceInfo
} from '@/api/approve'
// eslint-disable-next-line no-unused-vars
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import { searchUser } from '@/api/user'

export default {
  name: 'Approve',
  rules: { 'vue/no-template-shadow': 'off' },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      approveTypeOptions: [
        { text: '许可证工单', value: 'LICENSE' },
        { text: '装卸委托书工单', value: 'ENTRUST' },
        { text: '发货指令工单', value: 'ORDER' }
      ],
      approveRestoreOptions: [],
      approveInput: '',
      freeTableData: [],
      reserveTableData: [],
      logTableData: [],
      searchReserveTableInput: '',
      searchLogTableInput: '',
      approveResult: { flag: false, review: '' },
      orderApproveResult: { flag: false, review: '' },
      entrustApproveResult: { flag: false, restore: 0, review: '' },
      typeLicenseInfo: { account: '', company: '', name: '', auth: '', appkey: '' },
      typeLicenseLog: { account: '', company: '', name: '', auth: '', appkey: '', result: false, review: '' },
      typeEntrustInfo: { account: '', appkey: '', craft: '', arrive: '', auth: '', name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0 },
      typeEntrustLog: { account: '', appkey: '', craft: '', arrive: '', auth: '', name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0, restore: 0, result: false, review: '' },
      typeOrderInfo: { appkey: '', account: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '' },
      typeOrderLog: { appkey: '', account: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '', result: false, review: '' },
      typeOrderSpaceInfo: { appkey: '', name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0, restore: 0, process: 0.0 },
      entrustRestoreLog: '',
      typeLicenseInfoDrawerVisible: false,
      typeLicenseApproveDrawerVisible: false,
      typeLicenseLogDrawerVisible: false,
      typeEntrustInfoDrawerVisible: false,
      typeEntrustApproveDrawerVisible: false,
      typeEntrustLogDrawerVisible: false,
      typeOrderInfoDrawerVisible: false,
      typeOrderApproveDrawerVisible: false,
      typeOrderLogDrawerVisible: false,
      typeLicenseFile: [],
      typeEntrustFile: [],
      typeOrderFile: []
    }
  },
  computed: {
    ...mapGetters({
      token: 'token',
      flag: 'flag',
      userinfo: 'userinfo'
    }),
    isEntrustDealAble() { return this.entrustApproveResult.flag === true && this.entrustApproveResult.restore === 0 },
    permissionResForApprove() { return this.userinfo.grade === 1 },
    permissionResForSearch() { return this.userinfo.grade < 2 }
  },
  created() {
    this.refreshAllList()
  },
  methods: {
    refreshAllList() {
      this.searchKeyWordApprove()
      this.initReserveList()
      this.initLogList()
    },
    initFreeList() {
      getFreeList().then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.freeTableData = list
        } else { this.freeTableData = [] }
      })
    },
    initReserveList() {
      getReserveList(this.userinfo.account).then((res) => {
        this.reserveTableData = []
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.reserveTableData = list
        } else { this.reserveTableData = [] }
      })
    },
    initLogList() {
      getLogList(this.userinfo.account).then((res) => {
        this.logTableData = []
        // eslint-disable-next-line no-unused-vars
        const { flag, num, list } = res
        if (flag === true) {
          this.logTableData = list
        } else { this.logTableData = [] }
      })
    },
    handlePictureCardPreview(file) {
      // eslint-disable-next-line no-unused-vars
      const { name, url } = file
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleTypeLicenseClose() {
      this.typeLicenseFile = []
      this.dialogImageUrl = ''
      this.dialogVisible = false
      this.typeLicenseInfoDrawerVisible = false
      this.typeLicenseApproveDrawerVisible = false
      this.typeLicenseLogDrawerVisible = false
      this.approveResult.flag = false
      this.approveResult.review = ''
    },
    handleTypeEntrustClose() {
      this.typeEntrustFile = []
      this.dialogImageUrl = ''
      this.dialogVisible = false
      this.typeEntrustInfoDrawerVisible = false
      this.typeEntrustApproveDrawerVisible = false
      this.typeEntrustLogDrawerVisible = false
      this.approveResult.flag = false
      this.approveResult.review = ''
      this.entrustApproveResult.restore = 0
      this.entrustApproveResult.flag = false
      this.entrustApproveResult.review = ''
      this.approveRestoreOptions = []
      this.entrustRestoreLog = ''
    },
    approveResultColor(val) {
      if (val === true) { return 'success' }
      if (val === false) { return 'danger' }
    },
    approveResultText(val) {
      if (val === true) { return '通过' }
      if (val === false) { return '打回' }
    },
    searchKeyWordApprove() {
      if (!(this.approveInput === '')) {
        getKeyList(this.approveInput).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, num, list } = res
          if (flag === true) { this.freeTableData = list }
        })
      } else { this.initFreeList() }
    },
    approveTypeFilter(value, row) { return row.type === value },
    approveTypeColor(val) {
      if (val === 'LICENSE') { return '' }
      if (val === 'ENTRUST') { return 'success' }
      if (val === 'ORDER') { return 'info' }
    },
    approveTypeText(val) {
      if (val === 'LICENSE') { return '许可证工单' }
      if (val === 'ENTRUST') { return '装卸委托书工单' }
      if (val === 'ORDER') { return '发货指令工单' }
    },
    startApproveDeal() {
      let data = {}
      if (this.approveResult.review === '') {
        data = {
          appkey: this.typeLicenseInfo.appkey,
          account: this.userinfo.account,
          result: this.approveResult.flag,
          review: null
        }
      } else {
        data = {
          appkey: this.typeLicenseInfo.appkey,
          account: this.userinfo.account,
          result: this.approveResult.flag,
          review: this.approveResult.review
        }
      }
      dealOne(data).then((res) => {
        const { flag, mes } = res
        if (flag === true) {
          Message.success('审批结果提交成功')
          this.refreshAllList()
          this.handleTypeLicenseClose()
        } else { Message.error(mes) }
      })
    },
    approveReserve(appkey) {
      const data = {
        appkey: appkey,
        account: this.userinfo.account
      }
      reserveOne(data).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes } = res
        if (flag === true) { this.refreshAllList() }
      })
    },
    approveReserveReset(appkey) {
      const data = {
        appkey: appkey,
        account: this.userinfo.account
      }
      reserveReset(data).then((res) => {
        // eslint-disable-next-line no-unused-vars
        const { flag, mes } = res
        if (flag === true) { this.refreshAllList() }
      })
    },
    async approveDrawerShow(appkey, type, sign) {
      if (type === 'LICENSE') {
        if (sign < 3) { await this.getLicenseApprove(appkey, sign) }
        if (sign === 3) { await this.getLicenseLog(appkey) }
      }
      if (type === 'ENTRUST') {
        if (sign < 3) { await this.getEntrustApprove(appkey, sign) }
        if (sign === 3) { await this.getEntrustLog(appkey) }
      }
      if (type === 'ORDER') {
        if (sign < 3) { await this.getOrderApprove(appkey, sign) }
        if (sign === 3) { await this.getOrderLog(appkey) }
      }
    },
    async getLicenseApprove(appkey, sign) {
      await getLicense(appkey).then((res) => {
        this.typeLicenseInfo = res
        this.typeLicenseFile = []
        if (this.typeLicenseInfo.auth != null) {
          this.typeLicenseFile.push({
            name: 'licenseFile.jpeg',
            url: this.typeLicenseInfo.auth
          })
        }
      })
      if (sign === 1) { this.typeLicenseInfoDrawerVisible = true }
      if (sign === 2) { this.typeLicenseApproveDrawerVisible = true }
    },
    async getLicenseLog(appkey) {
      await getLicenseLog(appkey).then((res) => {
        this.typeLicenseLog = res
        this.typeLicenseFile = []
        if (this.typeLicenseLog.auth != null) {
          this.typeLicenseFile.push({
            name: 'licenseFile.jpeg',
            url: this.typeLicenseInfo.auth
          })
        }
      })
      this.typeLicenseLogDrawerVisible = true
    },
    async getEntrustApprove(appkey, sign) {
      await getEntrust(appkey).then((res) => {
        this.typeEntrustInfo = res
        this.typeEntrustFile = []
        if (this.typeEntrustInfo.auth != null) {
          const index = this.typeEntrustInfo.auth.indexOf('/entrust/')
          const fileName = this.typeEntrustInfo.auth.substring(index + 9)
          this.typeEntrustFile.push({
            name: fileName,
            url: this.typeEntrustInfo.auth
          })
        }
      })
      if (sign === 1) { this.typeEntrustInfoDrawerVisible = true }
      if (sign === 2) {
        await getRestoreList().then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, num, list } = res
          list.forEach((element) => {
            const { id, mes, vleft } = element
            this.approveRestoreOptions.push({
              value: id,
              label: mes,
              disabled: vleft < this.typeEntrustInfo.volume
            })
          })
        })
        this.typeEntrustApproveDrawerVisible = true
      }
    },
    async getEntrustLog(appkey) {
      await getEntrustLog(appkey).then((res) => {
        this.typeEntrustLog = res
        this.typeEntrustFile = []
        if (this.typeEntrustLog.auth != null) {
          const index = this.typeEntrustLog.auth.indexOf('/entrust/')
          const fileName = this.typeEntrustLog.auth.substring(index + 9)
          this.typeEntrustFile.push({
            name: fileName,
            url: this.typeEntrustLog.auth
          })
        }
        this.entrustRestoreLog = this.entrustLogRestoreText(this.typeEntrustLog.restore)
      })
      this.typeEntrustLogDrawerVisible = true
    },
    async getOrderApprove(appkey, sign) {
      await getOrder(appkey).then((res) => {
        this.typeOrderInfo = res
        this.typeOrderFile = []
        if (this.typeOrderInfo.auth != null) {
          const index = this.typeOrderInfo.auth.indexOf('/order/')
          const fileName = this.typeOrderInfo.auth.substring(index + 7)
          this.typeOrderFile.push({
            name: fileName,
            url: this.typeOrderInfo.auth
          })
        }
        getSpaceInfo(this.typeOrderInfo.goods).then((res) => {
          this.typeOrderSpaceInfo = res
        })
      })
      if (sign === 1) { this.typeOrderInfoDrawerVisible = true }
      if (sign === 2) { this.typeOrderApproveDrawerVisible = true }
    },
    async getOrderLog(appkey) {
      await getOrderLog(appkey).then((res) => {
        this.typeOrderLog = res
        this.typeOrderFile = []
        if (this.typeOrderLog.auth != null) {
          const index = this.typeOrderLog.auth.indexOf('/order/')
          const fileName = this.typeOrderLog.auth.substring(index + 7)
          this.typeOrderFile.push({
            name: fileName,
            url: this.typeOrderLog.auth
          })
        }
        getSpaceInfo(this.typeOrderLog.goods).then((res) => {
          this.typeOrderSpaceInfo = res
        })
      })
      this.typeOrderLogDrawerVisible = true
    },
    orderApproveResultChange(label) {
      if (label === true) { this.orderApproveResult.review = '' }
    },
    async startOrderDeal() {
      const data = {
        appkey: this.typeOrderInfo.appkey,
        account: this.userinfo.account,
        result: this.orderApproveResult.flag,
        review: this.orderApproveResult.review
      }
      await dealOrderApproval(data).then((res) => {
        Message.success(res.mes)
        this.refreshAllList()
        this.handleTypeOrderClose()
      })
    },
    handleTypeOrderClose() {
      this.orderApproveResult = { flag: false, review: '' }
      this.typeOrderInfo = { appkey: '', account: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '' }
      this.typeOrderLog = { appkey: '', account: '', agent: '', goods: '', value: 0.0, type: 0, craft: '', wagon: '', name: '', phone: '', arrive: '', auth: '', result: false, review: '' }
      this.typeOrderSpaceInfo = { appkey: '', name: '', signature: '', pack: '', value: 0.0, weight: 0.0, volume: 0.0, restore: 0, process: 0.0 }
      this.typeOrderFile = []
      this.typeOrderInfoDrawerVisible = false
      this.typeOrderLogDrawerVisible = false
      this.typeOrderApproveDrawerVisible = false
    },
    entrustApproveResultChange(label) {
      if (label === true) {
        this.entrustApproveResult.review = ''
      } else { this.entrustApproveResult.restore = 0 }
    },
    async startEntrustDeal() {
      const data = {
        appkey: this.typeEntrustInfo.appkey,
        account: this.userinfo.account,
        result: this.entrustApproveResult.flag,
        restore: this.entrustApproveResult.restore,
        review: this.entrustApproveResult.review === '' ? null : this.entrustApproveResult.review
      }
      await dealEntrustApproval(data).then((res) => {
        Message.success(res.mes)
        this.refreshAllList()
        this.handleTypeEntrustClose()
      })
    },
    entrustLogRestoreText(restore) {
      if (restore === 0) {
        return '无'
      } else { return restore + '号堆场' }
    },
    async searchReserveList(account) {
      let info = null
      await searchUser(account === '' ? this.userinfo.account : account).then((res) => {
        const { flag, grade } = res
        if (flag === false) {
          Message.info('未查找到指定的用户')
        } else {
          if (grade === 1) {
            Message.info('该用户为客户用户')
          } else { info = account }
        }
      })
      if (info != null) {
        await getReserveList(info).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, num, list } = res
          if (flag === true) {
            Message.success('拉取数据成功')
            this.reserveTableData = list
          } else { this.reserveTableData = [] }
        })
      }
    },
    async searchLogList(account) {
      let info = null
      await searchUser(account === '' ? this.userinfo.account : account).then((res) => {
        const { flag, grade } = res
        if (flag === false) {
          Message.info('未查找到指定的用户')
        } else {
          if (grade === 1) {
            Message.info('该用户为客户用户')
          } else { info = account }
        }
      })
      if (info != null) {
        await getLogList(info).then((res) => {
          // eslint-disable-next-line no-unused-vars
          const { flag, num, list } = res
          if (flag === true) {
            Message.success('拉取数据成功')
            this.logTableData = list
          } else { this.logTableData = [] }
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
.approve-container {}
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
.box-card-avatar {
  margin-top:10px;
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
.box-card-item-ship {
  font-family: title-regular;
  font-size: 15px;
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
