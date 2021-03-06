import React,{Component} from 'react';
import {
  View,
  Text,
  ListView,
  Image,
  StyleSheet,
  BackAndroid,
  Platform,
  TouchableHighlight,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';

import ViewPager from 'react-native-viewpager';
import DetailPage from './DetailPage';

// URL: http://news-at.zhihu.com/api/4/news/latest
// 响应实例：
//
// {
//     date: "20140523",
//     stories: [
//         {
//             title: "中国古代家具发展到今天有两个高峰，一个两宋一个明末（多图）",
//             ga_prefix: "052321",
//             images: [
//                 "http://p1.zhimg.com/45/b9/45b9f057fc1957ed2c946814342c0f02.jpg"
//             ],
//             type: 0,
//             id: 3930445
//         },
//     ...
//     ],
//     top_stories: [
//         {
//             title: "商场和很多人家里，竹制家具越来越多（多图）",
//             image: "http://p2.zhimg.com/9a/15/9a1570bb9e5fa53ae9fb9269a56ee019.jpg",
//             ga_prefix: "052315",
//             type: 0,
//             id: 3930883
//         },
//     ...
//     ]
// }


// http://news.at.zhihu.com/api/4/news/before/20131119
// {
//     date: "20131118",
//     stories: [
//         {
//             title: "深夜食堂 · 我的张曼妮",
//             ga_prefix: "111822",
//             images: [
//                 "http://p4.zhimg.com/7b/c8/7bc8ef5947b069513c51e4b9521b5c82.jpg"
//             ],
//             type: 0,
//             id: 1747159
//         },
//     ...
//     ]
// }
export default class Home extends Component {

  constructor(props){
    super(props)

    this.state = {
      loaded: false,
      top_stories: [],
      stories:[],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      pagerSource: new ViewPager.DataSource({
        pageHasChanged: (p1, p2) => p1 !== p2,
      }),
      tailLoading: false,
      dateIndex: ''
    }

    this.navigator = this.props.navigator;

    this.getLatestNews = this.getLatestNews.bind(this);
    this.getNews = this.getNews.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.renderList = this.renderList.bind(this);
    this.pressRow = this.pressRow.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
  }

  getLatestNews(){
    var state = this.state;
    var stories = state.stories;
    return fetch('https://news-at.zhihu.com/api/4/news/latest')
    .then((response) => response.json())
    .then((responseJson) => {
      state.top_stories = responseJson.top_stories;
      state.pagerSource = state.pagerSource.cloneWithPages(responseJson.top_stories)
      stories.push({id:0, title:responseJson.date})
      state.dateIndex = responseJson.date
      responseJson.stories.map((story) => stories.push(story))
      state.dataSource = state.dataSource.cloneWithRows(stories)
      state.stories = stories
      state.loaded = true
      this.setState(state)
    })
    .catch((error) => {
      console.log(error);
    })
    .done();
  }

  getNews(){
    var state = this.state;
    var stories = state.stories;
    const url = 'http://news.at.zhihu.com/api/4/news/before/' + state.dateIndex
    console.log(url);
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      stories.push({id:0, title:responseJson.date})
      state.dateIndex = responseJson.date
      responseJson.stories.map((story) => stories.push(story))
      state.dataSource = state.dataSource.cloneWithRows(stories)
      state.stories = stories
      state.tailLoading = false;
      this.setState(state)
    })
    .catch((error) => {
      console.log(error);
    })

  }

  componentDidMount() {
    if(Platform.OS === 'android'){
      BackAndroid.addEventListener('hardwareBackPress', this.onBackPress);
    }

    this.getLatestNews();
  }

  componentWillUnmount(){
    if(Platform.OS === 'android'){
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  onBackPress = () => {
    const nav = this.navigator;
    const routers = nav.getCurrentRoutes();
    if(routers.length > 1){
      return true
    }
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      return false;
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
    return true;
  }

  renderPage(story, pageID){

    return (
      <Image
        style={{flex:1}}
        source={{uri: story.image}}
        />
    );
  }

  renderHeader(){
    return (
      <View style={styles.headerContainer}>
        <ViewPager
          dataSource={this.state.pagerSource}
          renderPage={this.renderPage}
          />
      </View>
    );
  }

  renderFooter(){

    if(this.state.tailLoading)
    {
      return (
        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
          <Text style={{textAlign: 'center'}}>
            Loadding
          </Text>
          <ActivityIndicator />
        </View>
      );
    }
  }

  pressRow(id){

    const {navigator} = this.props
    if(navigator){
      navigator.push({
        name: 'Detail',
        Component: DetailPage,
        message: id.toString()
      })
    }

  }

  onEndReached(e) {
    //listView触底
    var state = this.state;

    if(state.tailLoading){
      return;
    }
    state.tailLoading = true;
    this.setState(state);
    this.getNews();
  }

  renderList(story) {
    if(story.id == 0){
      return (
        <View style={styles.cellDate}>
          <Text style={styles.storyTitle} numberOfLines={2} lineBreakMode="middle">
            {story.title}
          </Text>
        </View>
      );
    }
    else{
      return (
        <TouchableHighlight onPress={() => {this.pressRow(story.id)}}>
          <View style={styles.cellContainer}>
            <Image
              style={styles.storyImage}
              source={{uri: story.images[0]}} />
            <Text style={styles.storyTitle} numberOfLines={2} lineBreakMode="middle">
              {story.title}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
  }

  render(){
    if(this.state.loaded){
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderList}
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          onEndReached={this.onEndReached}

          />
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
    flex: 1,
    justifyContent: 'center'
  },
  loadingText: {
    textAlign: 'center',
  },
  cellDate:{
    height: 30
  },
  cellContainer:{
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    shadowColor: 'darkgrey',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  storyImage:{
    width: 60,
    height: 60,
  },
  storyTitle:{
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,

  },
  headerContainer:{
    height: 200
  },
});
