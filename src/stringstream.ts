import {StringStream as BaseStringStream} from "@codemirror/streamparser"

// Counts the column offset in a string, taking tabs into account.
// Used mostly to find indentation.
function countCol(string: string, end: number | null, tabSize: number, startIndex = 0, startValue = 0): number {
  if (end == null) {
    end = string.search(/[^\s\u00a0]/)
    if (end == -1) end = string.length
  }
  let n = startValue
  for (let i = startIndex; i < end; i++) {
    if (string.charCodeAt(i) == 9) n += tabSize - (n % tabSize)
    else n++
  }
  return n
}

/// Encapsulates a single line of input. Given to stream syntax code,
/// which uses it to tokenize the content. Extends the
/// [`StringStream`](#streamparser.StringStream) from
/// `@codemirror/streamparser` with look-ahead support and a movable
/// line start.
export class StringStream extends BaseStringStream {
  lineStart: number = 0

  /// Create a stream.
  constructor(
    /// The line.
    string: string,
    tabSize: number,
    /// The current indent unit size.
    indentUnit: number,
    public lookAhead: (n: number) => string,
    overrideIndent?: number
  ) {
    super(string, tabSize, indentUnit, overrideIndent)
  }

  // The column of the hidden line start. Reads the base class's
  // private tabSize, so that modes which overwrite it are respected.
  private lineStartColumn() {
    return this.lineStart ? countCol(this.string, this.lineStart, this["tabSize"]) : 0
  }

  /// True if we are at the start of the line.
  sol(): boolean {return this.pos == this.lineStart}

  /// Get the column position at `this.pos`.
  column() {
    return super.column() - this.lineStartColumn()
  }

  /// Get the indentation column of the current line.
  indentation() {
    let override = this["overrideIndent"]
    return override ?? super.indentation() - this.lineStartColumn()
  }

  hideFirstChars(n: number, inner: () => string | null) {
    this.lineStart += n
    try { return inner() }
    finally { this.lineStart -= n }
  }
}
