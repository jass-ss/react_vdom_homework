export function jsx(type, props, ...children) {
  return {
    type: type,
    props: props,
    children: { ...children },
  };
}

export function createElement(node) {
  // jsx를 dom으로 변환
  // console.log('node', node);

  const newElement = document.createElement(node.type);

  for (const i in node.children) {
    if (typeof node.children[i] === 'object') {
      const children = createElement(node.children[i]);
      newElement.append(children);
      //console.log('chil', children);
    } else {
      newElement.append(node.children[i]);
    }
  }

  for (const i in node.props) {
    newElement.setAttribute(i, node.props[i]);
  }

  //console.log(newElement);

  return newElement;
}

function updateAttributes(target, newProps, oldProps) {
  console.log('5번실행');
  // console.log('props', newProps, oldProps);
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)

  for (const i in newProps) {
    if (oldProps && oldProps[i] && newProps[i] === oldProps[i]) {
      continue;
    } else {
      target.setAttribute(i, newProps[i]);
    }
  }

  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인

  for (const i in oldProps) {
    if (newProps && newProps[i] && newProps[i] === oldProps[i]) {
      continue;
    } else {
      target.removeAttribute(i);
    }
  }
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    console.log('1번실행');
    parent.replaceChildren();
    return;
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료

  if (newNode && !oldNode) {
    console.log('2번실행');
    const element = createElement(newNode);
    parent.append(element);
    return;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (
    typeof newNode === 'string' &&
    typeof oldNode === 'string' &&
    newNode !== oldNode
  ) {
    console.log('3번실행');
    //const newElement = createElement(newNode);
    parent.replaceChildren();
    parent.append(newNode);

    return;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type !== oldNode.type) {
    console.log('4번실행');
    const newElement = createElement(newNode);
    parent.replaceChildren();
    parent.append(newElement);
    return;
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  if (typeof newNode === 'object' && typeof oldNode === 'object') {
    console.log('6번실행');
    const oldEle = parent.children[index];

    updateAttributes(oldEle, newNode.props, oldNode.props);

    let oldChildren = 0;
    let newChildren = 0;

    for (const i in newNode.children) {
      newChildren++;
    }
    for (const i in oldNode.children) {
      oldChildren++;
    }
    const target = oldChildren >= newChildren ? oldNode : newNode;

    for (const i in target.children) {
      render(oldEle, newNode.children[i], oldNode.children[i]);
    }
    return;
  }
}
