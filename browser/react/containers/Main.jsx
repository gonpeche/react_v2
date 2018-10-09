import React from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Albums from '../components/Albums';
import SingleAlbum from '../components/SingleAlbum';
import Artists from '../components/Artists'
import Artist from '../components/Artist'
import audio from '../audio';
import {Route, Redirect, Switch}  from 'react-router-dom';
import { O_NONBLOCK } from 'constants';

export default class Main extends React.Component {
  constructor(){
    super();
    this.state = {
      albums: [],
      selectedAlbum: {},
      selectedSong: {},
      isPlaying: false,
      currentSongList: [],
      progress: 0,
      artists: [],
      selectedArtist: {}
    };
    this.selectAlbum = this.selectAlbum.bind(this);
    this.deselectAlbum = this.deselectAlbum.bind(this);
    this.start = this.start.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectArtist = this.selectArtist.bind(this)
  }
  
  componentDidMount() {
    axios.get('/api/albums')
      .then(res => res.data)
      .then(serverAlbums => this.setState({ albums: serverAlbums }));
    audio.addEventListener('ended', () => {
      this.next();
    });
    audio.addEventListener('timeupdate', () => {
      this.setState({
        progress: 100 * audio.currentTime / audio.duration
      });
    });

    axios.get('/api/artists/')
    .then( respuesta => this.setState({artists: respuesta.data}))

  }
  
  selectAlbum(albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(serverAlbum => this.setState({ selectedAlbum: serverAlbum }));
  }
  
  selectArtist(artistId) {
    let p2 = axios.get(`/api/albums/${artistId}`).then(res => res.data)
    let p1 = axios.get(`/api/artists/${artistId}`).then(res => res.data)
    let p3 = axios.get(`/api/artists/${artistId}/songs`).then(res => res.data)

    Promise.all([p1,p2,p3])
    .then(respuesta => {
      this.setState({
        selectedArtist: {
          nombre: respuesta[0],
          album: respuesta[1],
          songs: respuesta[2],
        }
      })
    })

  }
    
  

  deselectAlbum() {
    this.setState({ selectedAlbum: {} });
  }

  start(song, songs) {
    this.setState({ selectedSong: song, currentSongList: songs })
    this.loadSong(song.audioUrl);
  }

  loadSong(audioUrl) {
    audio.src = audioUrl;
    audio.load();
    this.play();
  }

  play() {
    audio.play();
    this.setState({ isPlaying: true })
  }

  pause() {
    audio.pause();
    this.setState({ isPlaying: false })
  }
  
  findSongIndex() {
    return this.state.currentSongList.findIndex(song => song.id === this.state.selectedSong.id);
  }

  next() {
    let index = this.findSongIndex() + 1;
    if (index >= this.state.currentSongList.length) {
      index = 0 
    }
    const song = this.state.currentSongList[index];
    this.setState({ selectedSong: song })
    this.loadSong(song.audioUrl)
  }

  previous() {
    let index = this.findSongIndex() - 1;
    if (index < 0) {
      index = this.state.currentSongList.length - 1 
    }
    const song = this.state.currentSongLists[index];
    this.setState({ selectedSong: song })
    this.loadSong(song.audioUrl)
  }

  render() {
    const  { albums, selectedAlbum, selectedSong, isPlaying, progress } = this.state;
    return (
      <div id="main" className="container-fluid">
        <Sidebar deselectAlbum={this.deselectAlbum} />
        <div className="col-xs-10">

        
        <Switch>
        <Route path="/albums/:id" render={ ({match}) => <SingleAlbum selectAlbum={this.selectAlbum} albumID={match.params.id} selectedSong={selectedSong} start={this.start} album={selectedAlbum}/>} />
        <Route path="/albums" render={() => <Albums albums={albums} selectAlbum={this.selectAlbum}/>} />
        <Route path="/artist/:id" render={({match}) => <Artist artistId={match.params.id} selectedArtist={this.state.selectedArtist}  selectArtist={this.selectArtist}/>} />
        <Route path="/artists" render={() => <Artists artists={this.state.artists}/>} />
        <Redirect exact from="/" to="/albums"/>
        </Switch>
        
        </div>
        <Footer 
          selectedSong={selectedSong}
          isPlaying={isPlaying} 
          play={this.play} 
          pause={this.pause}
          next={this.next}
          previous={this.previous}
          progress={progress}
        />
      </div>
    );
  }
};