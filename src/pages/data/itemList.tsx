import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Radio, RadioGroup, Picker } from '@tarojs/components'
import { AtInput, AtTabBar, AtDivider, AtMessage, AtFab, AtButton, AtInputNumber, AtList, AtListItem } from 'taro-ui'
import * as formSvr from '../../services/form'
import { set as globalset, get as globalget, set, CONSTS } from '../../global_data.js'
import './item.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  config: Config = {
    navigationBarTitleText: ''
  }
  state = {
    formId: '',//操作表单编号
    parsFormId: '',//参数表单编号，即弹出的表单编号
    fields: [],
    operate: { name: '', typeId: '', apiAddress: '' },//当前操作
    datas: { totalCount: 0, items: [] },
    selectedIds: [],
    editItem: {},//编辑对象
    showItem: {},//编辑对象显示值
    pickIndex: {},//选择器的选中下标，用于显示
    scanInfo: '',//扫描到的内容
    scanLog: []//扫描记录
  }
  /**
   *
   */
  constructor(props) {
    super(props);

  }
  componentWillReceiveProps(props) {
    console.log('props')
  }
  componentWillMount() {
    const operate = this.props.operate;
    const selectedIds = this.props.selectedIds;
    this.state.operate = operate;
    this.state.selectedIds = selectedIds;
    this.state.formId = this.props.formId;


    formSvr.queryByIdAndReturnField(this.state.parsFormId, selectedIds).then((res) => {
      const data = res.data.result;
      this.state.fields = data.fields;
      let items = data.datas.items;
      if (this.state.operate.name == '编辑') {
        // this.state.editItem = items[0];
        this.state.showItem = items[0];
      }
      this.state.fields.map((v, i) => {
        if (v.type == 'singleSelect' || v.type == 'qrySelect') {
          formSvr.getSelectSrc(v.id, '').then(srcres => {
            v._src = srcres.data.result.items;
            // let itemValue = this.state.operate.name == '编辑' ? items[0][v.dataIndex].id : v.defaultValue;//当编辑时获取存储的值，其他操作获取默认值
            if (this.state.operate.name != '编辑') {
              let findIndex = v._src.findIndex((item) => {//找到id匹配的项用于显示汉字
                return item.id == v.defaultValue
              })
              if (findIndex > -1)
                this.state.showItem[v.dataIndex] = v._src[findIndex].name;
              this.state.editItem[v.dataIndex] = v.defaultValue;
            }
            this.setState({ fields: data.fields })
          })
        }
      })
      formSvr.qryRelaForm(this.props.formId).then((res) => {
        console.log(res)
      })
      this.setState({ fields: data.fields, datas: data.datas })
    }).catch(err => console.log(err))
    Taro.setNavigationBarTitle({ title: operate.name ? operate.name : '' })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  render() {
    const { datas, fields, selectedIds, operate, editItem, showItem } = this.state;
    return (
      <View>
        <AtMessage />
        {
          fields.map((field) => {
            switch (field.type) {
              case 'scan':
                {
                  return <View key={field.id}>
                    <AtInput
                      title={field.name}
                      disabled={field.isReadOnly}
                      placeholder={field.tip}
                      value={showItem[field.dataIndex]}
                    />
                  </View>;
                }
                break;
              case 'qrySelect': {
                return <View key={field.id}>
                  <Picker mode='selector' range={field._src} rangeKey='name'>
                    <View className='picker'>
                      {field.name}:<Text style={{ marginLeft: '5px' }}>{this.state.showItem[field.dataIndex]}</Text>
                    </View>
                  </Picker>
                </View >;
              }
                break;
              case 'singleSelect': {
                return <View key={field.id}>
                  <Picker mode='selector' range={field._src} rangeKey='name' >
                    <View className='picker'>
                      {field.name}:<Text style={{ marginLeft: '5px' }}>{this.state.showItem[field.dataIndex]}</Text>
                    </View>
                  </Picker>
                </View >;
              }
                break;
              case 'date': {
                return <View key={field.id}>
                  <Picker mode='date' range={field._src} rangeKey='name'>
                    <View className='picker'>
                      {field.name}:<Text style={{ marginLeft: '5px' }}>{this.state.showItem[field.dataIndex]}</Text>
                    </View>
                  </Picker>
                </View >;
              }
                break;
              case 'txt': {
                return <View key={field.id}>
                  <AtInput
                    title={field.name}
                    disabled={field.isReadOnly}
                    placeholder={field.tip}
                    value={showItem[field.dataIndex]}
                  />
                </View>;
              }
                break;
              case 'txtArea': {
                return <View key={field.id}>
                  <AtInput
                    title={field.name}
                    disabled={field.isReadOnly}
                    placeholder={field.tip}
                    value={showItem[field.dataIndex]}
                  />
                </View>;
              }
                break;
              case 'num': {
                return <View key={field.id} >
                  <AtInput
                    title={field.name}
                    disabled={field.isReadOnly}
                    placeholder={field.tip}
                    value={showItem[field.dataIndex]}
                  />
                </View>;
              }
                break;
            }
          })
        }
        <AtDivider />

      </View >
    )
  }
}
