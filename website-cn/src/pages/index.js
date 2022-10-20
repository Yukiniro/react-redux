import React, { useEffect } from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useThemeContext from '@theme/hooks/useThemeContext'
import styles from './styles.module.css'

const features = [
  {
    content: (
      <p>
        React Redux由Redux团队维护并{' '}
        <strong>保持与Redux和React的最新API同步</strong>。
      </p>
    ),
    image: <img src="img/noun_Certificate_1945625.svg" />,
    imageAlign: 'top',
    title: '官方',
  },
  {
    content: (
      <p>
        <strong>旨在与React的组件模型一起工作。</strong>{' '}
        由你定义如何从Redux中提取你的组件需要的值，你的组件会根据需要自动更新。
      </p>
    ),
    image: <img src="img/noun_Check_1870817.svg" />,
    imageAlign: 'top',
    title: '可预见',
  },
  {
    content: (
      <p>
        提供 <strong>允许你的组件和 Redux 的 store 进行交互的</strong> API ,
        所以你不需要自己写逻辑.
      </p>
    ),
    image: <img src="img/noun_Box_1664404.svg" />,
    imageAlign: 'top',
    title: '封装',
  },
  {
    content: (
      <p>
        自动实现 <strong>复杂的性能优化</strong>
        ，所以你的组件只有在其所依赖的数据实际发生变化时才会重现渲染。
      </p>
    ),
    image: <img src="img/noun_Rocket_1245262.svg" />,
    imageAlign: 'top',
    title: '优化',
  },
]

const otherLibraries = [
  {
    content: '一个可预测的JavaScript应用程序的状态容器',
    title: 'Redux',
    link: 'https://redux.js.org',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        data-icon="external-link-square-alt"
        data-prefix="fas"
        viewBox="0 0 448 512"
      >
        <path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z"></path>
      </svg>
    ),
  },
  {
    content: '官方的、可选的、功能齐备的工具集，用于高效的 Redux 开发',
    title: 'Redux Toolkit',
    link: 'https://redux-toolkit.js.org',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        data-icon="external-link-square-alt"
        data-prefix="fas"
        viewBox="0 0 448 512"
      >
        <path d="M448 80v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48zm-88 16H248.029c-21.313 0-32.08 25.861-16.971 40.971l31.984 31.987L67.515 364.485c-4.686 4.686-4.686 12.284 0 16.971l31.029 31.029c4.687 4.686 12.285 4.686 16.971 0l195.526-195.526 31.988 31.991C358.058 263.977 384 253.425 384 231.979V120c0-13.255-10.745-24-24-24z"></path>
      </svg>
    ),
  },
]

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://buttons.github.io/buttons.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <div className={styles.title}>
            <img
              src="img/redux_white.svg"
              alt="Redux logo"
              width="100"
              height="100"
            />
            <h1 className={`${styles.projectTitle} hero__title`}>
              {siteConfig.title}
            </h1>
          </div>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('introduction/getting-started')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className={classnames('container', styles.featureBlock)}>
              <div className="row">
                {features.map(({ image, title, content }, idx) => (
                  <div key={idx} className={classnames('col', styles.feature)}>
                    {image && (
                      <div className={`text--center ${styles.blockImage}`}>
                        {image}
                      </div>
                    )}
                    <h2 className={`text--center ${styles.featureTitle}`}>
                      {title}
                    </h2>
                    <div className={styles.featureContent}>{content}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {otherLibraries && otherLibraries.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                <div className="col">
                  <h2 className={`text--center ${styles.secondTitle}`}>
                    Redux 团队的其他库
                  </h2>
                </div>
              </div>
              <div className="row">
                {otherLibraries.map(({ image, title, content, link }, idx) => (
                  <div
                    key={idx}
                    className={classnames('col col--6', styles.feature)}
                  >
                    <h2 className="text--center">
                      <a href={link} className={styles.featureAnchor}>
                        {title}
                        {image}
                      </a>
                    </h2>
                    <p className="text--center">{content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default Home
