import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtDivider, AtMessage，AtNoticebar  } from 'taro-ui'
import { set as globalset, get as globalget, CONSTS, getHeader } from '../../global_data.js'
import './index.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '欢迎登录一点通应用'
  }

  state = {
    uid: '',
    pwd: '',
    remeberClient: true,
    tenancyName: '',
    showTenancy: 'none',
    shareId:'666'
  }
  componentWillMount() {
    Taro.getStorage({ key: 'tenancyName' }).then((res) => {
      this.setState({ tenancyName: res.data });
    })
    Taro.getStorage({ key: 'uid' }).then((res) => {
      this.setState({ uid: res.data });
    })
    Taro.getStorage({ key: 'pwd' }).then((res) => {
      this.setState({ pwd: res.data });
    })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleUidChange = (v) => {
    this.setState({ uid: v })
  }
  handlePwdChange = (v) => {
    this.setState({ pwd: v })
  }
  handleTenancyNameChange = (v) => {
    this.setState({ tenancyName: v })
  }


  hanleOnClick = () => {
    Taro.setStorage({ key: 'tenancyName', data: this.state.tenancyName })
    Taro.setStorage({ key: 'uid', data: this.state.uid })
    Taro.setStorage({ key: 'pwd', data: this.state.pwd })
    Taro.request({
      url: CONSTS.ServiceURL + '/api/TokenAuth/Authenticate',
      data: {
        userNameOrEmailAddress: this.state.uid,
        password: this.state.pwd,
        remeberClient: this.state.remeberClient,
        tenancyName: this.state.tenancyName
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      }
    }).then((res) => {
      if (res.statusCode == 200) {
        const token = res.data.result.accessToken;
        CONSTS.TOKEN = token;//全局保存token
        Taro.request({
          url: CONSTS.ServiceURL + '/app/Form/GetAll',//?InputStr=&SkipCount=0&MaxResultCount=10&QueryKey=&typeId=&undefined',
          data: {
            InputStr: '',
            SkipCount: 0,
            MaxResultCount: 10,
            QueryKey: '',
            typeId: ''
          },
          header: getHeader()
        }).then((res2) => {
          if (res2.statusCode == 200) {
            globalset('menu', res2.data.result.items)
             Taro.redirectTo({ url: '/pages/main/index2' });
           // Taro.redirectTo({ url: '/pages/share/item' });
          } else {
            Taro.atMessage({ message: res2.data.error.message, type: 'error' })
          }
        })
      } else {
        Taro.atMessage({ message: res.data.error.message, type: 'error' })
      }
    })
  }

  hanleSwitchClick = () => {
    this.setState({ showTenancy: 'block' });
  }
  render() {
    const { showTenancy } = this.state;
    
    return (
      <View className='index'>
        <AtMessage />
        <View style={{ marginTop: "100px" }}>
          <View className='t1'>应用一点通</View>
          <View className='t2'></View>
          <AtInput customStyle={{ marginTop: "30px", display: showTenancy }} name='tname' placeholder='请输入租户代码' title='租户代码' value={this.state.tenancyName} onChange={this.handleTenancyNameChange} />
          <AtInput name='uid' placeholder='请输入用户名' title='用户名' value={this.state.uid} onChange={this.handleUidChange} />
          <AtInput name='pwd' placeholder='请输入密码' title='密码' type='password' value={this.state.pwd} onChange={this.handlePwdChange} />
          <AtButton type='primary' customStyle={{ marginTop: "20px" }} onClick={this.hanleOnClick}>登录</AtButton>
          <AtButton type='secondary' customStyle={{ marginTop: "20px" }} onClick={this.hanleSwitchClick}>切换租户</AtButton>
          <View style={{ textAlign: 'center', marginTop: '50px' }}>
            <Text>{CONSTS.Company}</Text>
          </View>
          <View style={{ textAlign: 'center', marginTop: '5px' }}>
            <Text>{CONSTS.Slogan}</Text>
          </View>
        </View>
      </View>
    )
  }
}
