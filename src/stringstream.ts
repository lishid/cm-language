import {StringStream as BaseStringStream} from "@codemirror/streamparser"

/// Encapsulates a single line of input. Given to stream syntax code,
/// which uses it to tokenize the content. Extends the
/// [`StringStream`](#streamparser.StringStream) from
/// `@codemirror/streamparser` with look-ahead support.
export class StringStream extends BaseStringStream {
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
}
