import React, { PureComponent } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'


class SortableMediaList extends PureComponent {

  static propTypes = {
    media: ImmutablePropTypes.list.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  getDeleteLinkStyle = (isDragging) => ({
    display: isDragging ? 'none' : 'block'
  })

  getItemStyle = (draggableStyle, isDragging) => ({
    userSelect: 'none',
    ...draggableStyle,
  })

  render() {
    const { media, onDragEnd, onDelete } = this.props

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshotGlobal) => (
            <div ref={provided.innerRef}>
              {media.map(medium => (
                <Draggable key={medium.get('pk')} draggableId={medium.get('pk')}>
                  {(provided, snapshot) => (
                    <div className="sortable-medium mr-3 mb-3">
                      <a
                        href="/"
                        className="btn-sortable-medium-delete"
                        style={this.getDeleteLinkStyle(snapshotGlobal.isDragging)}
                        onClick={onDelete.bind(this, medium.get('pk'))}
                      >
                        <i className="fa fa-times"></i>
                      </a>
                      <div
                        ref={provided.innerRef}
                        style={this.getItemStyle(provided.draggableStyle, snapshot.isDragging)}
                        {...provided.dragHandleProps}
                      >
                        {medium.get('type') === 'video' && <video
                          className="img-fluid" src={medium.get('url')} controls />}
                        {medium.get('type') === 'audio' && <audio
                          className="img-fluid" src={medium.get('url')} controls
                          style={{ paddingTop: '60%', background: '#000' }} />}
                        {medium.get('type') === 'image' && <img
                          className="img-fluid" src={medium.get('url')} alt="Medium" />}
                        {medium.get('type') === 'embed' && <div
                          className="embed-wrapper"
                          dangerouslySetInnerHTML={{ __html: medium.get('embed') }}
                        />}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default SortableMediaList
