class Matrix extends Array {
  #rows;
  #cols;

  constructor(rows, cols) {
    super(rows);
    for (let i = 0; i < rows; i++)
      this[i] = new Array(cols);

    this.#rows = rows;
    this.#cols = cols;
  }

  get rows() {
    return this.#rows;
  }

  get cols() {
    return this.#cols;
  }

  copy() {
    const ret = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++)
        ret[i][j] = this[i][j];
    }
    return ret;
  }

  delRow(row) {
    this.splice(row, 1);
    this.#rows--;
  }

  delCol(col) {
    this.map(row => row.splice(col, 1));
    this.#cols--;
  }

  static det(matrix) {
    if (matrix.rows === 1 && matrix.cols === 1)
      return matrix[0][0];
    
    let sum = 0;
    for (let i = 0, neg = 1; i < matrix.cols; i++, neg *= -1)
      sum += neg * matrix[0][i] * matrix.minor(0,i);
    return sum;
  }

  minor(row, col) {
    const ret = this.copy();
    ret.delRow(row);
    ret.delCol(col);
    return Matrix.det(ret);
  }
}
