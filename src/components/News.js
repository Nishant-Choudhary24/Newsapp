import React, { Component } from 'react'
import NewsComponent from './NewsComponent'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
export class News extends Component {
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
  static defaultProps = {
    country: "in",
    pageSize: 6,
    category: 'general'
  }
  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults : 0
    }
  }
  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f383f81f8a05493e95258de6fff260b8&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({
      loading: true
    })
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(60);
    this.setState({
      totalResults: parsedData.totalResults,
      articles: parsedData.articles,
      loading: false
    })
    this.props.setProgress(100);
  }
  async componentDidMount() {
    this.updateNews();
  }

  handleNextClick = async () => {
    /*if (!(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize ) )){
    let url =  `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f383f81f8a05493e95258de6fff260b8&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    this.setState({
      loading : true
    })
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      page : this.state.page + 1 ,
      articles : parsedData.articles ,
      loading : false
    })
  }*/
    this.setState({
      page: this.state.page + 1
    })
    this.updateNews();
  }
  handlePreviousClick = async () => {
    /*let url =  `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f383f81f8a05493e95258de6fff260b8&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
    this.setState({
      loading : true
    })
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      page : this.state.page - 1 ,
      articles : parsedData.articles ,
      loading : false
    })*/
    this.setState({
      page: this.state.page - 1
    })
    this.updateNews();
  }
  fetchMoreData =async()=>{
    this.setState({
      page: this.state.page +1
    })
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f383f81f8a05493e95258de6fff260b8&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
    
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults
    })
  }
  render() {
    return (
      <>
        <h1 className='text-center my-3'>NewsApp - Top Headlines</h1>
        {this.state.loading && <Spinner/> }
        <InfiniteScroll
          dataLength={this.state.articles.length} //This is important field to render the next data
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader= {<Spinner/>} >
            <div className='container'>
          <div className="row">
            {this.state.articles.map((element) => {
              return <div className='col-md-4 my-3' key={element.url} >
                <NewsComponent title={element.title } author={element.author} source={element.source.name} publishedAt={element.publishedAt} description={element.description } imageUrl={element.urlToImage ? element.urlToImage : "https://images.firstpost.com/wp-content/uploads/2023/05/u.jpg"} newsUrl={element.url} />
              </div>
            })}
          </div>
          </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News
