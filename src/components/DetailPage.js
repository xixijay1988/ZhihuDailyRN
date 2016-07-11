import React,{Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  WebView,
  ActivityIndicator,
  BackAndroid
} from 'react-native';

//http://news-at.zhihu.com/api/4/news/3892357
// {
//     body: "<div class="main-wrap content-wrap">...</div>",
//     image_source: "Yestone.com 版权图片库",
//     title: "深夜惊奇 · 朋友圈错觉",
//     image: "http://pic3.zhimg.com/2d41a1d1ebf37fb699795e78db76b5c2.jpg",
//     share_url: "http://daily.zhihu.com/story/4772126",
//     js: [ ],
//     recommenders": [
//         { "avatar": "http://pic2.zhimg.com/fcb7039c1_m.jpg" },
//         { "avatar": "http://pic1.zhimg.com/29191527c_m.jpg" },
//         { "avatar": "http://pic4.zhimg.com/e6637a38d22475432c76e6c9e46336fb_m.jpg" },
//         { "avatar": "http://pic1.zhimg.com/bd751e76463e94aa10c7ed2529738314_m.jpg" },
//         { "avatar": "http://pic1.zhimg.com/4766e0648_m.jpg" }
//     ],
//     ga_prefix: "050615",
//     section": {
//         "thumbnail": "http://pic4.zhimg.com/6a1ddebda9e8899811c4c169b92c35b3.jpg",
//         "id": 1,
//         "name": "深夜惊奇"
//     },
//     type: 0,
//     id: 4772126,
//     css: [
//         "http://news.at.zhihu.com/css/news_qa.auto.css?v=1edab"
//     ]
// }

export default class DetailPage extends Component{

  constructor(props){
    super(props)
    this.state = {
      id: this.props.message,
      content: 'null',
      loaded: false,
    }
    this.getFeedDetial = this.getFeedDetial.bind(this)
    this.goBack = this.goBack.bind(this)


  }

  goBack(){
    const {navigator} = this.props;
    if(navigator){
      navigator.pop();
    }
  }

  getFeedDetial(){
    var state = this.state;
    return fetch('https://news-at.zhihu.com/api/4/news/' + state.id)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('response')
      state.content = responseJson
      state.loaded = true
      console.log(state)
      this.setState(state)
    })
    .catch((error) => {
      console.log(error);
    })
    .done();
  }

  componentDidMount() {
    var _this = this
    BackAndroid.addEventListener('hardwareBackPress', function() {
        _this.goBack();
        return true;
    });
    this.getFeedDetial();
  }

  componentWillUnmount(){
    BackAndroid.removeEventListener('hardwareBackPress', function() {
        return true;
    });
  }



  render(){

    if(this.state.loaded)
    {
      var content = this.state.content.css
      var css = content[0]
      var HTML = '<link rel="stylesheet" type="text/css" href="' + css + '" />' + this.state.content.body;
      return (
        <View style={styles.container}>

          <WebView
            style={styles.container}
            source={{html: HTML}}
            scalesPageToFit={true}
            >

          </WebView>
        </View>

      );
    }
    else{
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large"/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
  },
  image:{
    height: 200,
    marginTop: 0,
  },
  web:{
    flex:1,
    marginTop: -200,
    paddingTop: -200
  }
})
