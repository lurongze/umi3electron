import React, { cloneElement, ReactElement, useEffect, useState } from 'react';
import {
  Input,
  Menu,
  Form,
  message,
  Button,
  Tree,
  Cascader,
  TreeSelect,
  Select,
} from 'antd';
import { list, listType } from '@/data/nav';
import { isFuncAndRun, isEmpty } from '@/utils/helper';
import { addArticle, updateArticle, getArticle } from '@/utils/tcb';

interface formType {
  name: string;
}
interface propsType {
  children?: ReactElement;
  onSuccess?: Function;
  onCancel?: Function;
  articleId?: string;
}

const LAYOUT_FORM_LAYOUT = {
  labelCol: {
    flex: '0 0 80px',
    xs: { flex: '0 0 80px' },
    sm: { flex: '0 0 80px' },
  },
};

function Editor(props: propsType) {
  const { onSuccess, onCancel, articleId = '' } = props;
  const [form] = Form.useForm();

  function onFinish(values: formType) {
    if (!isEmpty(articleId)) {
      updateArticle(articleId, values).then((res: any) => {
        if (res?.updated) {
          message.success('保存成功！');
          isFuncAndRun(onSuccess);
        }
      });
    } else {
      addArticle(values).then((res: any) => {
        if (res?.id) {
          message.success('保存成功！');
          isFuncAndRun(onSuccess);
        }
      });
    }
  }

  function getArticleData(id: string) {
    getArticle(id).then((res: any) => {
      if (res?.data && res.data.length !== 0) {
        const record = res.data[0];
        form.setFieldsValue(record);
      }
    });
  }

  useEffect(() => {
    if (!isEmpty(articleId)) {
      getArticleData(articleId);
    }
  }, [articleId]);

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="moduleKey"
          label="所属模块"
          required
          {...LAYOUT_FORM_LAYOUT}
        >
          <Select>
            {list.map((s: listType) => (
              <Select.Option key={s.key} value={s.key}>
                {s.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="title" label="标题" required {...LAYOUT_FORM_LAYOUT}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="内容" required {...LAYOUT_FORM_LAYOUT}>
          <Input.TextArea style={{height: 300}} />
        </Form.Item>
        <Form.Item {...LAYOUT_FORM_LAYOUT}>
          <div
            style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <Button
              style={{ margin: '0 10px' }}
              type="primary"
              onClick={() => form.submit()}
            >
              保存
            </Button>
            <Button
              style={{ margin: '0 10px' }}
              onClick={() => isFuncAndRun(onCancel)}
            >
              取消
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

export default Editor;
