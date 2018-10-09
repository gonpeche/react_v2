import React from 'react';

class Artist extends React.Component {

    componentDidMount() {
        this.props.selectArtist(this.props.artistId)
    }
    render() {
        console.log(this.props.selectedArtist)
        return (
            <div>
            <h2>{this.props.selectedArtist.nombre}</h2>
            <h4>{this.props.selectedArtist.album}</h4>
            <h4>{this.props.selectedArtist.songs}</h4>
            </div>
            
            )
        } 
    }

    
export default Artist;