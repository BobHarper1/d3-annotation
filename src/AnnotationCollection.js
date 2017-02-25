export default class AnnotationCollection {

  constructor({ annotations, accessors, accessorsInverse }) {
    this.accessors = accessors
    this.accessorsInverse = accessorsInverse
    this.annotations = annotations
  }

  clearTypes(newSettings) {
    this.annotations.forEach(d => {
      d.type = undefined
      d.subject = newSettings && newSettings.subject ||{}
      d.connector = newSettings && newSettings.connector || {}
      d.note = newSettings && newSettings.note || {}
    })
  }

  update() { this.annotations.forEach(d => d.type.update())}

  editMode(editMode) { this.annotations.forEach(a => {
      if (a.type) {
        a.type.editMode = editMode
        a.type.updateEditMode()
      }
    })
  }

  updateDisable(disable) {
    this.annotations.forEach(a => {
      a.disable = disable
      if (a.type){
        disable.forEach(d => {
          if (a.type[d]){
          a.type[d].remove && a.type[d].remove()
          a.type[d] = undefined
          }
        })
      }
    })
  }

  updateTextWrap(textWrap) {
    this.annotations.forEach(a => {
      if (a.type){
        a.type.updateTextWrap(textWrap)
      }
    })
  }

  updateNotePadding(notePadding) {
    this.annotations.forEach(a => {
      if (a.type){
        a.type.notePadding = notePadding
      }
    })
  }

  get json() { 
    return this.annotations.map(a => {      
      const json = a.json
      if (this.accessorsInverse){
        json.data = {}
        Object.keys(this.accessorsInverse).forEach(k => {
          json.data[k] = this.accessorsInverse[k]({ x: a.x, y: a.y})
        })
      }
      return json
    })
  }

  //TODO: should all annotations have a key?
  //If so what would that help? could that map to priority? 
  //

  get textNodes(){
    return this.annotations.map(a => ({ ...a.type.getTextBBox(), startX: a.x, startY: a.y }))
  }

  //TODO: come back and rethink if a.x and a.y are applicable in all situations
  get connectorNodes() {
    return this.annotations.map(a => ({ ...a.type.getConnectorBBox(), startX: a.x, startY: a.y}))
  }

  get subjectNodes() {
    return this.annotations.map(a => ({ ...a.type.getSubjectBBox(), startX: a.x, startY: a.y}))
  }

  get annotationNodes() {
    return this.annotations.map(a => ({ ...a.type.getAnnotationBBox(), startX: a.x, startY: a.y}))
  }
}
