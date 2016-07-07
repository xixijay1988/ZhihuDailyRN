import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';

//http://news-at.zhihu.com/api/4/start-image/720*1184
// {
//     text: "© Fido Dido",
//     img: "http://p2.zhimg.com/10/7b/107bb4894b46d75a892da6fa80ef504a.jpg"
// }

export default class SplashComponent extends Component{


  constructor(props){
    super(props)
    this.state ={
      isLoading: true,
      imgurl: '',
      imgText: ''


    }
  }

  componentDidMount() {
    this.getSplashImage()
  }

  getSplashImage(){

    var state = this.state;
    return fetch('http://news-at.zhihu.com/api/4/start-image/720*1184')
          .then((response) => response.json())
          .then((responseJson) => {

            console.log(responseJson.text);
            state.isLoading = false;
            state.imgurl = responseJson.img
            state.imgText = responseJson.text
            this.setState(state)
            return ;
          })
          .catch((error) => {
            console.error(error);
          });
  }

  render(){

      if(this.state.isLoading)
      {
        return (
          <View style={styles.container}>
            <Text style={styles.loadingText}>
              Loading
            </Text>
          </View>
        );
      }
      else{
        return(
          <View style={styles.container}>

              <Image style={styles.splashImage} source = {{uri: this.state.imgurl}}>
                  <Text style={styles.splashText}>
                    {this.state.imgText}
                  </Text>

              </Image>

          </View>

        );
    }
  }

}

const styles = StyleSheet.create({

  container:{
    flex : 1,
    justifyContent:'center',
  },
  splashImage:{
    flex: 1,
    justifyContent:'flex-end',
  },
  loadingText:{
    textAlign:'center'
  },
  splashText:{
    textAlign: 'right',
    fontSize: 20,
    color: 'white',
    margin: 20,


  }



});
