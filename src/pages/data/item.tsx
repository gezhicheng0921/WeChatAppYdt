import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Radio, RadioGroup, Picker } from '@tarojs/components'
import { AtInput, AtTabBar, AtDivider, AtMessage, AtFab, AtButton, AtInputNumber, AtList, AtListItem，AtTextarea,AtCard } from 'taro-ui'
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
    formName:'',
    parsFormId: '',//参数表单编号，即弹出的表单编号
    fields: [],
    operate: { name: '', typeId: '', apiAddress: '' },//当前操作
    datas: { totalCount: 0, items: [] },
    selectedIds: [],
    editItem: {},//编辑对象
    showItem: {},//编辑对象显示值
    pickIndex: {},//选择器的选中下标，用于显示
    scanInfo: '',//扫描到的内容
    scanLog: [],//扫描记录
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
    if (operate.parsFormId && operate.parsFormId.length > 0) {
      this.state.parsFormId = operate.parsFormId;
    } else this.state.parsFormId = this.props.formId;

    formSvr.queryByIdAndReturnField(this.state.parsFormId, selectedIds).then((res) => {
      const data = res.data.result;
      this.state.fields = data.fields;
      let items = data.datas.items;
      if (this.state.operate.name == '编辑'||this.state.operate.name == '分享') {
        // this.state.editItem = items[0];
        this.state.showItem = items[0];
      }
      this.state.fields.map((v, i) => {
        if (v.type == 'singleSelect' || v.type == 'qrySelect') {
          formSvr.getSelectSrc(v.id, '').then(srcres => {
            v._src = srcres.data.result.items;
            // let itemValue = this.state.operate.name == '编辑' ? items[0][v.dataIndex].id : v.defaultValue;//当编辑时获取存储的值，其他操作获取默认值
            if (this.state.operate.name != '编辑'&&this.state.operate.name != '分享') {
              let findIndex = v._src.findIndex((item) => {//找到id匹配的项用于显示汉字
                return item.id == v.defaultValue
              })
              if (findIndex > -1)
                this.state.showItem[v.dataIndex] = v._src[findIndex].name;
              this.state.editItem[v.dataIndex] = v.defaultValue;
            }
            this.setState({ fields: data.fields })
          })
        } else {
          if (this.state.operate.name != '编辑'&&this.state.operate.name != '分享') {
            this.state.showItem[v.dataIndex] = v.defaultValue;
            this.state.editItem[v.dataIndex] = v.defaultValue;
          }
        }
      })

      this.setState({ fields: data.fields, datas: data.datas })
    }).catch(err => console.log(err))
    Taro.setNavigationBarTitle({ title: operate.name ? operate.name : '' })
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
 

  handleBarClick = (value) => {
    const curOper = this.state.operate;
    const formId = this.state.formId;
    const selectedIds = this.state.selectedIds;
    const editItem = this.state.editItem;
    const showItem = this.state.showItem;
    if (value == 0) {
      switch (curOper.name) {
        case '添加':
          if (curOper.apiAddress.length == 0)
            formSvr.add(formId, editItem).then(res => {
              if (res.statusCode == 200) { Taro.atMessage({ message: '添加成功！', type: "success" }) }
              else { Taro.atMessage({ message: res.data.error.message, type: "error" }) }
            })
          break;
        case '编辑':
          if (curOper.apiAddress.length == 0) {
            if (selectedIds.length > 1)
              Taro.atMessage({ message: '请选择一条数据编编辑', type: "error" })
            formSvr.edit(formId, selectedIds[0], editItem).then(res => {
              if (res.statusCode == 200) { Taro.atMessage({ message: '编辑成功！', type: "success" }) }
              else { Taro.atMessage({ message: res.data.error.message, type: "error" }) }
            })
          }

          break;
        default:
          formSvr.operate(curOper, formId, selectedIds, editItem).then(res => {
            if (res.statusCode == 200) { Taro.atMessage({ message: '提交成功！'+res.data.result.msg.Msg, type: "success" }) }
            else { Taro.atMessage({ message: res.data.error.message, type: "error" }) }
          })
          break;
      }
    } else {
      this.props.Close();
    }
  }
  // handleEditSubmit = () => {
  //   let { editModel, datas, editItem } = this.state;
  //   if (editModel == 'edit') {
  //     for (let index = 0; index < datas.length; index++) {
  //       if (datas[index].id == editItem._id) {
  //         datas[index] = editItem;
  //         break;
  //       }
  //     }
  //     this.setState({ openEdit: false, editModel: '' });
  //   }
  //   else {
  //     for (let index = 0; index < datas.length; index++) {
  //       datas[index]._selected = false
  //     }
  //     datas.unshift({ ...editItem, _selected: true });
  //     this.setState({ openEdit: false, editModel: '' });
  //   }
  // }
  handleInputChange = (field, value) => {
    this.state.editItem[field.dataIndex] = value;
    this.setState({ editItem: { ...this.state.editItem } });
  }

  hanleDateSelectChange = (field, e) => {
    this.state.editItem[field.dataIndex] = e.detail.value;
    this.setState({ editItem: { ...this.state.editItem } });
  }

  handleSelectChange = (field, e) => {
    this.state.editItem[field.dataIndex] = field._src[e.detail.value].id;
    this.state.showItem[field.dataIndex] = field._src[e.detail.value].name;

    this.setState({ showItem: { ...this.state.showItem } });
  }
  handleScan = (field, e) => {
    Taro.scanCode().then(res => {
      this.state.editItem[field.dataIndex] = res.result;
      this.setState({ editItem: this.state.editItem, scanLog: [res.result, ...this.state.scanLog] })
      this.handleBarClick(0);
    })
  }
  render() {
    const { datas, fields, selectedIds, operate, editItem, showItem} = this.state;
    return (
      <View>
        <AtMessage />
        {
   
          fields.map((field) => {
            const data1=field.name+':'+showItem[field.dataIndex];
            console.log(data1);
            
            if(operate.name=='分享'){
           return <View>
                    <span>
                      {data1}
                  </span>
                  <br/>
             </View>

            }else{
              switch (field.type) {
              case 'scan':
                {
                  return <View key={field.id}>
                    <AtInput
                      title={field.name}
                      disabled={field.isReadOnly}
                      placeholder={field.tip}
                      value={showItem[field.dataIndex]}
                      onChange={this.handleInputChange.bind(this, field.dataIndex)}
                    />
                    {field.type == 'scan' ? (<AtButton type='primary' onClick={this.handleScan.bind(this, field)}>扫描</AtButton>) : <span></span>}
                  </View>;
                }
                break;
              case 'qrySelect': {
                return <View key={field.id}>
                  <Picker mode='selector' range={field._src} rangeKey='name' onChange={this.handleSelectChange.bind(this, field)}>
                    <View className='picker'>
                      {field.name}:<Text style={{ marginLeft: '5px' }}>{this.state.showItem[field.dataIndex]}</Text>
                    </View>
                  </Picker>
                </View >;
              }
                break;
              case 'singleSelect': {
                return <View key={field.id}>
                  <Picker mode='selector' range={field._src} rangeKey='name' onChange={this.handleSelectChange.bind(this, field)}>
                    <View className='picker'>
                      {field.name}:<Text style={{ marginLeft: '5px' }}>{this.state.showItem[field.dataIndex]}</Text>
                    </View>
                  </Picker>
                </View >;
              }
                break;
              case 'date': {
                return <View key={field.id}>
                  <Picker mode='date' range={field._src} rangeKey='name' onChange={this.hanleDateSelectChange.bind(this, field)}>
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
                    onChange={this.handleInputChange.bind(this, field)}
                  />
                </View>;
              }
                break;
              case 'txtArea': {
                return <View key={field.id}>
                    {field.name=='备注'||field.name=='说明'?<AtTextarea
                    value=''
                    onChange={this.handleInputChange.bind(this, field)}
                    maxLength={200}
                    placeholder={ field.name}
                    /> :<AtInput
                    title={field.name}
                    disabled={field.isReadOnly}
                    placeholder={field.tip}
                    value={showItem[field.dataIndex]}
                    onChange={this.handleInputChange.bind(this, field)}
                /> }
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
                    onChange={this.handleInputChange.bind(this, field)}
                  />
                </View>;
              }

                break;
              }
            }
        })
        }
        {
          this.state.scanLog.length > 0 ? <View style={{ textAlign: 'center', marginTop: '50px' }}>
            <AtDivider></AtDivider>
            <Text>扫描记录</Text>
            <AtList>
              {
                this.state.scanLog.map((v) => {
                  return <AtListItem title={v} />
                })
              }
            </AtList>
          </View> : ''
        }


        {/* <View style={{ textAlign: 'center', marginTop: '50px' }}>
          <AtDivider></AtDivider>
          <Text>技术支持：中鼎科技</Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: '5px' }}>
          <Text>数据一点通方案提供商</Text>
        </View> */}
        {this.state.operate.name=='分享'?'':
          <AtTabBar
          fixed
          current={1}
          tabList={[
            { title: '提交', iconType: 'check' },
            { title: '返回', iconType: 'close' },
          ]}
          onClick={this.handleBarClick.bind(this)}
        />
        }
      </View >
    )
  }
}
