import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import * as Latex from 'react-latex';
import { Canvas } from './components/Canvas';

function Introduction() {
  return (
    <div>
      <h1>
        MARCHING SQUARES
      </h1>
      <p className="lead">2D Contouring Demonstration by <a href="https://rogerngo.com">Roger Ngo</a></p>
      <div className="rule"></div>
      <p>
        <a href="https://en.wikipedia.org/wiki/Marching_squares">Marching squares</a> is a graphics algorithm which generates contours in a 2-dimensional scalar field.
        There are two types of contours which can be generated:
      </p>
      <ol>
        <li><strong>Isolines</strong> - Lines which are created by hint of an isovalue</li>
        <li><strong>Isobands</strong> - Areas filled between the isolines</li>
      </ol>
      <p>
        For this project, I will be discussing the implementation of <strong>marching squares with isolines</strong>. 
      </p>
    </div>
  );
}

function Code() {
  return (
    <div>
      <h2>DOWNLOADING CODE 💾</h2>
      <p>
        If you would like to follow along through code, or see the full implementation, I have made the source code, along with this web page's source available on GitHub.
      </p>
      <p>
        Navigate to the repository: <a href="https://github.com/urbanspr1nter/marching-squares">https://github.com/urbanspr1nter/marching-squares</a>.
      </p>
    </div>
  );
}

function Demonstration() {
  return (
    <div>
      <h2>DEMONSTRATION</h2>
      <p className="lead">For the impatient. 😎</p>
      <div className="rule"></div>
      <div className="container">
        <div className="row justify-content-md-center">
          <Canvas />
        </div>
      </div>
    </div>
  );
}

function Implementation() {
  return (
    <div>
      <h2>IMPLEMENTATION</h2>
      <p className="lead">How to Implement Marching Squares</p>
      <div className="rule"></div>
      <p>
        The following sections will explain how to implement marching squares. This guide will discuss not only 
        theoretical concepts, but in addition, practical examples implemented in JavaScript.
      </p>
    </div>
  );
}

function Grid() {
  return (
    <div>
      <h3>
        1. GRID
      </h3>
      <p>
        The grid, <Latex>$G$</Latex>, comprises of elements where each element is a cell value <Latex>{'$G_{ij}$'}</Latex>.
        These can be floating point, or even integral. Marching squares is a <a href="https://en.wikipedia.org/wiki/Divide_and_conquer">divide-and-conquer algorithm</a> 
        where each iteration of the algorithm is applied within a <Latex>$2\times2$</Latex> sub-grid <Latex>$C$</Latex> of cells <Latex>{'$C_{ij}$'}</Latex>.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img alt="cell value" src="assets/cell_value.png" />
        </div>
      </div>
    </div>
  );
}

function Isovalue() {
  return (
    <div>
      <h3>
        2. ISOVALUE
      </h3>
      <p>
        Given a grid of cells, the isovalue, <Latex>$v$</Latex> is a value which serves as a threshold for which we can determine a 
        bipolar edge. In the case of marching squares, a cell value <Latex>{'$C_{ij}$'}</Latex> can be a vertex which may belong in two states:
      </p>
      <ol>
        <li><strong>ON (1)</strong> - The value of the cell is equal to, or <strong>greater than the isovalue.</strong></li>
        <li><strong>OFF (0)</strong> - The value of the cell is <strong>less than the isovalue.</strong></li>
      </ol>
      <p>
        In code, obtaining a state of the cell value based on isovalue can be implemented as a simple function:
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
        <pre>
          <code>
{`
  function getState(value, isovalue) {
    return value >= isovalue ? 1 : 0;
  }`
}
          </code>
        </pre>
        </div>
      </div>
    </div>
  );
}

function Edges() {
  return (
    <div>
      <h3>
        3. EDGES
      </h3>
      <p>
        Edges connect two vertices. The edge endpoints lie between <strong>bipolar pairs</strong> of vertices. A bipolar pair is when two vertices are in opposite states.
      </p>
      <p>
        Here is an example of a bipolar pair of vertices:
      </p>
      <div className="container">
        <div className="row justify-content-lg-center">
          <div className="col">
            <pre>
              <code>
                (1) --- (0)
              </code>
            </pre>
          </div>
        </div>
      </div>
      <p>
        We can determine the endpoint of an edge by placing the endpoint <strong>at the midpoint</strong> between two bipolar vertices. Once two endpoints 
        have been found, they may be connected to form the edge.
      </p>
      <p>
        This can be easily found through a midpoint formula, assuming there are two points <Latex>$P_0$</Latex>, and <Latex>$P_1$</Latex>.
        It can be expressed by the following function:
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <pre>
            <code>
              {
                `
export function getEndpointByMidpoint(p0, p1) {
    const x = Math.trunc(p0.x + ((p1.x - p0.x) / 2));
    const y = Math.trunc(p0.y + ((p1.y - p0.y) / 2));
    
    return {x, y}
}
                `
              }
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function Cases() {
  return (
    <div>
      <h3>4. CASES</h3>
      <p>
        There are a total of <strong>16 configurations</strong> in which a <Latex>$2\times2$</Latex> sub-grid can represent the edge. 
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img alt="16 cases" src="assets/rn-marching-squares-cases.png" />
        </div>
        <div className="row justify-content-md-center">
          <p>
            Picture from Wikipedia
          </p>
        </div>
      </div>
      <p>
        There are two ambiguous cases which need to be considered: <strong>5</strong>, and <strong>10</strong>. However, I will defer that discussion for now. Instead, I will explain 
        the algorithm.
      </p>
    </div>
  );
}

function Algorithm() {
  return (
    <div>
      <h3>5. ALGORITHM</h3>
      <p>
        <strong>Determine the vertex values</strong>
      </p>
      <ul>
        <li>
          Iterate through the grid, <Latex>{'$G$'}</Latex> taking a <Latex>$2\times2$</Latex> sub-grid sample each iteration.
        </li>
        <li>
          Obtain the <code>topLeft</code>, <code>topRight</code>, <code>bottomRight</code>, and <code>bottomLeft</code> coordinates along 
          with the corresponding cell values associated with them.
        </li>
        <li>
          We have a grid of cell values, <Latex>$G$</Latex>, where are accessible by indexing into the grid <Latex>{'$G_{ij}$'}</Latex> where <Latex>$i$</Latex>, 
          and <Latex>$j$</Latex> represents the current row, and column respectively.
        </li>
        <li>
          Iterate through the grid <Latex>$G$</Latex> to determine each vertex value in comparison to the isovalue <Latex>$v$</Latex>. Set the vertex value 
          at <Latex>$G$</Latex> to <Latex>$1$</Latex> if the cell value <Latex>{'$G_{ij}$'}</Latex> is at, or about the isovalue, and <Latex>$0$</Latex>, if below.
        </li>
      </ul>
      <p>
        <strong>Associate 2x2 sub-grid with the cases</strong>
      </p>
      <ul>
        <li>
          Iterate through <Latex>$G$</Latex>. At each <Latex>$2\times2$</Latex> iteration, we will form a 4-bit binary code based on the vertex value 
          by iterating clockwise from the top-left corner to the bottom-left corner. As we iterate, we perform a bitwise left-shift to make room for the next bit.
        </li>
        <li>
          Once the binary code has been determined, we have our case. Then we find the midpoint between two bipolar vertices and construct the edge based o the case found 
          using the 4-bit code.
        </li>
      </ul>
    
      <div className="container">
        <div className="row justify-content-md-center">
          <pre>
            <code>
              {`
export function getCase(values) {
  if (values.length < 4) {
      throw new Error("There must be 4 values given to retrieve the case.");
  }
  
  let code = 0;
  for(let i = 0; i < values.length; i++) {
      code = (code << 1) | values[i];
  }
  
  return code & 15;
}
              `}
            </code>
          </pre>
        </div>
        <div className="row justify-content-sm-center">
          <img src="assets/rn-marching-squares-case-construction.png" alt="case construction" />
        </div>
        <div className="row justify-content-sm-center">
          <p>Case construction traversing clockwise across the cell</p>
        </div>
      </div>
    </div>
  );
}

function Ambiguity() {
  return (
    <div>
      <h3>
        6. HANDLING AMBIGUITY
      </h3>
      <p>
        As mentioned earlier, of the <strong>16 cases</strong> needing to be considered in determining how to draw the edges, notice that <strong>case 5 and 10 are ambiguous</strong>. 
        That is, given a set of endpoints, we do not know how to draw the lines in a specific direction as the endpoints of these two cases are the same.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img src="assets/rn-marching-squares-case-5.png" alt="case 5" />
        </div>
      </div>
      <p>
        Don't see it yet? Let's remove the edges with my awesome photo-editing skills, and say that we are going to draw edges from scratch for our bipolar vertices.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img src="assets/rn-marching-squares-blank-5.png" alt="blank 5" />
        </div>
      </div>
      <p>
        Let's mark the endpoints at the midpoint (relatively) between the bipolar vertices.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img src="assets/rn-marching-squares-locations-case-5.png" alt="marked" />
        </div>
      </div>
      <p>
        Knowing what case 5 looks like, we can simply connect the edges together like this:
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img src="assets/rn-marching-squares-case-locations-connected-1-5.png" alt="marked" />
        </div>
      </div>
      <p>
        Does this look familiar? For those with the keen eye, you will notice that the edges go in the same direction as case 10.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-sm">
            <img src="assets/rn-marching-squares-locations-connected-2-5.png" alt="marked" />
          </div>
          <div className="col-sm">
            <img src="assets/rn-marching-squares-case-10.png" alt="case 10" />
          </div>
        </div>
      </div>
      <p>
        In order to ensure that the <strong>edges are drawn correctly</strong>, we can disambiguate the cases by averaging the values at the four vertices. If the average 
        falls above the isovalue, consider the lines going in specific directions.
      </p>
      <p>
        Now, this way, we can make sense of a collection of 4 endpoints, and the directions in which we must draw them in.
      </p>
    </div>

  );
}

function LinearInterpolation() {
  return (
    <div>
      <h3>7. LINEAR INTERPOLATION</h3>
      <p>
        With the traditional midpoint approach to building the edges for the marching squares algorithm, we may find that the final product may not generate 
        circular contours very well. The main reason is because it was chosen that the edge endpoints were placed using the midpoint between the bipolar edges.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img src="assets/midpoint_contour.jpg" alt="contour using midpoint" />
        </div>
        <div className="row justify-content-md-center">
          Contoured using the midpoint approach.
        </div>
      </div>
      <p>
        Notice how the effect seems to generate blocky contours? Well, we can do better.
      </p>
      <p>
        To take it as step further, and generate finer contours, we can improve by using <strong>linear interpolation</strong> to place the endpoint of the edges 
        at a better location based on the isovalue with respect to the original values of the cells.
      </p>
      <p>
        First, the linear interpolation formula:
      </p>
      <p>
        <Latex>
          $$
          P(t) = (1 - t)P_0 + tP_1
          $$
        </Latex>
      </p>
      <p>
        We can calculate <Latex>$t$</Latex> from the isovalue, <Latex>$v$</Latex> and two vertex values <Latex>$f_1$</Latex> and <Latex>$f_2$</Latex>.
      </p>
      <p>
        <Latex>
        {
          `$$t = \\frac{v - f_1}{f_2 - f_1}$$`
        }
        </Latex>
      </p>
      <p>
        This code can be written as:
      </p>
      <div className="container">
        <div className="row justify-content-lg-center">
          <pre>
            <code>
              {`
export function getT(f1, f2, isovalue) {
  const v2 = Math.max(f2.v, f1.v);
  const v1 = Math.min(f2.v, f1.v);
  return (isovalue - v1) / (v2 - v1);
}
              `}
            </code>
          </pre>
        </div>
      </div>
      <p>
        We can then make use of it with a linear interpolation function, which can be implemented like:
      </p>
      <div className="container">
        <div className="row justify-content-lg-center">
          <pre>
            <code>
              {`
export function getEndpointByInterpolation(p0, p1, t) {
  const x = Math.trunc((1 - t) * p0.x + t * p1.x);
  const y = Math.trunc((1 - t) * p0.y + t * p1.y);

  return {x, y};
}
              `}
            </code>
          </pre>
        </div>
      </div>
      <p>
        Then once <Latex>$t$</Latex> has been found, we can find the position by using <Latex>$P_0$</Latex> and <Latex>$P_1$</Latex> position of the cells which contain  
        {' '}<Latex>$f_1$</Latex> and <Latex>$f_2$</Latex> respectively.
      </p>
      <div className="container">
        <div className="row justify-content-md-center">
          <img src="assets/linear_interpolation_contour.jpg" alt="contour using linear interpolation" />
        </div>
        <div className="row justify-content-md-center">
          Contoured using linear interpolation.
        </div>
      </div>
    </div>
  );
}

function References() {
  return (
    <div>
      <h3>8. REFERENCES</h3>
      <p>
        Here are some good references to read more about the marching squares algorithm.
      </p>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Marching_squares">Wikipedia Article</a> - https://en.wikipedia.org/wiki/Marching_squares</li>
        <li><a href="http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/">Metaballs and Marching Squares</a> - http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/</li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col md-auto">
          <Introduction />
          <Code />
          <Demonstration />
          <Implementation />
          <Grid />
          <Isovalue />
          <Edges />
          <Cases />
          <Algorithm />
          <Ambiguity />
          <LinearInterpolation />
          <References />
          <footer>
            <h3>More...</h3>
            <p>
              Visit my <a href="https://rogerngo.com">personal webpage</a> (https://rogerngo.com) if you're interested in reading more about my projects and adventures! 😊
            </p>
          </footer>
        </div>
        <hr/>
      </div>
    </div>
  );
}

export default App;
