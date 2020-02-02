import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto; 
`;

export const Header = styled(Container)`
  text-align: center; 
  color: palevioletred;
  font-weight: bold;
  font-size: 24px;
  padding: 20px;
`;


export const Main = styled(Container)``

export const BoxToggle = styled.div`
  max-width: 300px;
  margin: 30px auto;
  text-align: center;
`;

export const BoxExpand = styled.div`
  max-width: 300px;
  color: #fff;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  background-color: #12b47d;
  border-radius: 4px;
  margin: 20px;
  flex: auto;
`;
export const BoxExpand1 = styled(BoxExpand)`
  background-color: #7795f8;
`;

export const Button = styled.a`
  cursor: pointer;
  white-space: nowrap;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
  background: #3ecf8e;
  text-shadow: 0 1px 3px rgba(36,180,126,.4);
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .025em;
  color: #fff;
  text-decoration: none;
  
  &:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
  }
`;

export const ExpandBoxes = styled.div`
  display: flex;
  justify-content: space-around;
`;


// export const BoxToggle = styled.li`
//   max-width: 300px;
//   margin: 30px auto;
//   text-align: center;
// `;
//
//
// export const panel-group = {
//   margin-top: 30px;
// }
//
//
// export const panel-collapse = {
//   max-height: 500px;
//   overflow: hidden;
//   transition: max-height .5s ease;
// }
//
// export const panel-close = {
//   max-height: 0;
// }