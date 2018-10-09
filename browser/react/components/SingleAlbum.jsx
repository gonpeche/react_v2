import React, { Component } from 'react';
import Songs from './Songs';


class SingleAlbum extends Component {

  componentDidMount () {
    this.props.selectAlbum(this.props.albumID)
  }

    render () {
      const {album, albumID, selectedSong,start} = this.props
      return (  
        <div className="album">
          <div>
            <h3>{album.name}</h3>
            <img src={`/api/albums/${albumID}/image`} className="img-thumbnail" />
          </div>
          <Songs 
            songs={album.songs}
            start={start}
            selectedSong={selectedSong}
          />
        </div>
      )

    }
}

export default SingleAlbum;