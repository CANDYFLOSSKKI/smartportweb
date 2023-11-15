import { getInfo, login, logout, updateBasicInfo, updatePassword, bindEmail, delEmail, delLicense } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  state.token = getToken()
  state.flag = false
  state.userinfo = {
    id: 0,
    account: '',
    password: '',
    grade: 0,
    name: '',
    email: '',
    portrait: '',
    enable: 0
  }
}

const state = {
  token: '',
  flag: false,
  userinfo: {
    id: 0,
    account: '',
    password: '',
    grade: 0,
    name: '',
    email: '',
    portrait: '',
    enable: 0
  }
}

const mutations = {
  RESET_STATE: (state) => {
    getDefaultState()
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_FLAG: (state, flag) => {
    state.flag = flag
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password }).then(response => {
        const { flag, token } = response
        if (flag === true) {
          commit('SET_TOKEN', token)
          commit('SET_FLAG', flag)
          setToken(token)
          resolve()
          Message.success('登录成功')
        } else {
          reject()
          Message.warning('用户名或密码错误')
        }
      })
    })
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { flag, userinfo } = response
        if (!flag) {
          removeToken()
          commit('RESET_STATE')
          commit('SET_FLAG', false)
          resolve()
          Message.error('获取最新用户信息失败')
        } else {
          commit('SET_USERINFO', userinfo)
          resolve()
        }
      })
    })
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken()
        commit('RESET_STATE')
        commit('SET_FLAG', false)
        resetRouter()
        resolve()
        Message('登出成功')
      })
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      commit('SET_FLAG', false)
      resolve()
    })
  },

  updateBasic({ commit }, basicInfo) {
    return new Promise((resolve, reject) => {
      updateBasicInfo(basicInfo).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          resolve()
          Message.success(mes)
        } else {
          reject()
          Message.error(mes)
        }
      })
    })
  },

  updatePass({ commit }, passInfo) {
    return new Promise((resolve, reject) => {
      updatePassword(passInfo).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          resolve()
          Message.success(mes)
        } else {
          reject()
          Message.error(mes)
        }
      })
    })
  },

  updateBindEmail({ commit }, emailInfo) {
    return new Promise((resolve, reject) => {
      bindEmail(emailInfo).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          resolve()
          Message.success(mes)
        } else {
          reject()
          Message.error(mes)
        }
      })
    })
  },

  delBindEmail({ commit }, emailInfo) {
    return new Promise((resolve, reject) => {
      delEmail(emailInfo).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          resolve()
          Message.success(mes)
        } else {
          reject()
          Message.error(mes)
        }
      })
    })
  },

  delBindLicense({ commit }, licenseInfo) {
    return new Promise((resolve, reject) => {
      delLicense(licenseInfo).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          resolve()
          Message.success(mes)
        } else {
          reject()
          Message.error(mes)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

