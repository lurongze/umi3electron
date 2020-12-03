import React, {
  cloneElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Input,
  Menu,
  Form,
  message,
  Button,
  Tree,
  Cascader,
  Dropdown,
  Select,
} from 'antd';
import { connect } from 'umi';
import classnames from 'classnames';
import {
  FundViewOutlined,
  PictureOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import Editor from '@monaco-editor/react';
import Picture from './picture';
import styles from './index.less';

const languageList = ['markdown', 'javascript'];

function EditorItem(props) {
  const {
    global: { currentArticle = {} },
    articleModel: { articleContent = {} },
    dispatch,
    loading,
    onSaveSuccess,
  } = props;
  const editorRef = useRef();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [language, setLanguage] = useState(languageList[0]);

  function saveArticle() {
    dispatch({
      type: 'articleModel/saveArticleContent',
      payload: {
        articleId: currentArticle._id,
        content: editorRef.current() || '',
        success() {
          message.info('保存成功！');
          isFuncAndRun(onSaveSuccess);
        },
      },
    });
  }

  function getContent(articleId) {
    dispatch({
      type: 'articleModel/getArticleContent',
      payload: { articleId },
    });
  }

  useEffect(() => {
    if (!isEmpty(currentArticle?._id)) {
      getContent(currentArticle._id);
    }
  }, [currentArticle]);

  const menu = (
    <Menu>
      {languageList.map(s => (
        <Menu.Item key={s} onClick={() => setLanguage(s)}>
          {s}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className={classnames(styles.editorContainer)}>
      <Editor
        height="calc(100vh - 50px)"
        className={styles.editorItem}
        value={articleContent?.content || ''}
        loading={loading}
        editorDidMount={e => {
          setIsEditorReady(true);
          editorRef.current = e;
        }}
      />
      <div className={styles.footer}>
        <Button
          loading={loading}
          disabled={!isEditorReady}
          className={styles.buttons}
          type="primary"
          onClick={saveArticle}
        >
          <SaveOutlined />
          保存
        </Button>

        <Button
          loading={loading}
          disabled={!isEditorReady}
          className={styles.buttons}
          type="primary"
          onClick={() => isFuncAndRun(onSaveSuccess)}
        >
          <FundViewOutlined />
          查看文章
        </Button>

        <Picture>
          <Button
            disabled={!isEditorReady}
            className={styles.buttons}
            type="primary"
          >
            <PictureOutlined />
            图片上传
          </Button>
        </Picture>
        <Dropdown.Button
          className={styles.buttons}
          trigger={['click']}
          overlay={menu}
          disabled={!isEditorReady}
        >
          当前语言：{language}
        </Dropdown.Button>
      </div>
    </div>
  );
}

export default connect(({ global, articleModel, loading }) => ({
  global,
  articleModel,
  loading: loading.effects['articleModel/getArticleContent'],
}))(EditorItem);
