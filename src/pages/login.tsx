import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import styles from './login.less';


export default function Page() {
  const [userInfo, setUserInfo] = useState<userInfo>({email: "", password: ""})
  const updteUserInfo = (value: string, type: string) => {
    setUserInfo({
      ...userInfo,
      [type]: value,
    })
  }
  const login = async () => {
    const res = await fetch('/api/login', { 
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.status !== 200) {
      console.error(await res.text());
      return;
    }
    const data = await res.json();
    alert(`欢迎回来，${data.name}`);
    history.push('/posts/create');
    // setPosts(await res.json());

  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{marginTop: 12}}>
        <span>邮箱: </span>
        <input type="email" value={userInfo.email} onChange={e => {updteUserInfo(e.target.value, "email")}} />
      </div>
      <div style={{marginTop: 12}}>
        <span>密码: </span>
        <input type="password" value={userInfo.password} onChange={e => {updteUserInfo(e.target.value, "password")}} />
      </div>
      <div>
        <button 
          style={{marginTop: 12}} 
          onClick={login}
        >
          登录
        </button>
      </div>
    </div>
  );
}
