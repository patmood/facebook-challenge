// Reference: https://github.com/substack/stream-handbook

import through from 'through2'
import { Readable } from 'stream'


// Input will be a string - normally binary
const split = through(
  function(chunk, encoding, callback) {

    const [lines, unfinishedPiece] = processChunk(this._unfinishedPiece, chunk)
    for (let line of lines) {
      this.push(line)
    }
    this._unfinishedPiece = unfinishedPiece
    // console.log(this._unfinishedPiece);
    callback()
  },
  function (callback) {
    this.push(this._unfinishedPiece)
    callback()
  }
)

const tests = {

}


// unfinished, chunk -> lines, unfinished
// string, string -> list of strings, string

const processChunk = (unfinished, chunk) => {
  unfinished = unfinished || ''

  const lines = chunk.toString().split('\n')

  if (lines.length === 1) {
    unfinished = unfinished + chunk
    return [[], unfinished]
  } else {
    lines[0] = unfinished + lines[0]
    return [lines.slice(0,-1), lines.slice(-1)[0]]
  }
}



// Stream from stdin to split function:
// process.stdin.setEncoding('utf8').pipe(split).on('data', (data) => { console.log(data.toString().toUpperCase()) })

// Run using:
// (echo -n foo; sleep 1; echo bar; sleep 1; echo -n baz) | babel-node split.js

// JS Created stream:
const rs = new Readable
rs.push('beep ')
rs.push('boop\n')
rs.push('bop\n')
rs.push(null)
rs.pipe(split).on('data', (data) => { console.log(data.toString().toUpperCase()) })

// TODO:
// Use through to process stream of events into stream of rows into stream of columnized rows
// Tap into columnized rows to render to DOM


