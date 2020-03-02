import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtGrid, AtIcon, AtTabBar,AtDivider } from 'taro-ui'
import { set as globalset, get as globalget, set, CONSTS } from '../../global_data.js'
import './index2.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '主界面'
  }
  /**
   *
   */
  state = {
    menu: [],
    comp:[]
  }
  constructor() {
    super();
    this.setState({ menu: globalget('menu') });
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
 
  showMenu = (menu) => {
    const iconColor = '#97CBFF';
    const iconSize = 30;
    let menudata = [];
    let index=0;
    let isExist=false;
    menu.map((v) => {
      // menudata.push({
      //   iconInfo: { value: v.iconFile, size: iconSize, color: iconColor },
      //   value: v.name,
      //   id: v.id
      // })
        if(menudata.length==0){
            var obj =new Object()
            obj.id=v.categoryName;
            obj.data=[];
            menudata[index]=obj;
            index++;
        }
        menudata.map((j)=>{
          if(j.id==v.categoryName){
            isExist=true;
          }
        })
        if(!isExist){
          var obj =new Object()
          obj.id=v.categoryName;
          obj.data=[];
          menudata[index]=obj;
          index++;
      }
        menudata.map((j)=>{
            if(j.id==v.categoryName){
                j.data.push({
                    iconInfo: { value: v.iconFile, size: iconSize, color: iconColor },
                    value: v.name,
                    id: v.id
                  })
               
            }
        })
      
      isExist=false;

      
     
    //  menudata.push(menudata2)
    })
    console.log(menu);
    console.log('显示'+menudata);
    return menudata;
  }
  handleGridClick = (item) => {
    Taro.navigateTo({ url: '/pages/data/list?id=' + item.id + '&name=' + item.value })
    return;
    switch (item.value) {
      case '追溯查询':
        Taro.navigateTo({ url: '/pages/query/index' })
        break;
      case '关于':
        Taro.navigateTo({ url: '/pages/about/index' })
        break;
      default:
        break;
    }
  }
  // handleBarClick = () => {
  //   Taro.redirectTo({ url: '/pages/index/index' })
  // }
  render() {
    const { menu } = this.state;
    let menudata = this.showMenu(menu);
    console.log(menudata);
    return (
      <View className='index'>
         {menudata.map(v=>{
         return  <div>
              <AtDivider content={v.id} ></AtDivider> 
         {/* <Text className='CmenuTitleName'>{v.id}</Text> */}
         <AtGrid onClick={this.handleGridClick} data={v.data} />
         
         </div> 
        })} 
      
        
         {/* <AtGrid onClick={this.handleGridClick} data={menudata} /> */}
        
        {/* <AtTabBar
     
          fixed
          tabList={[
            { title: '退出', iconType: 'close' },
          ]}
          onClick={this.handleBarClick.bind(this)}
        /> */}
      </View>
    )
  }
}
