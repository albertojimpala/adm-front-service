import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Form, Row } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { verify } from '../../Service/Api';

export const VerifyScreen = () => {
  const token = useParams();
  const [form] = Form.useForm();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const onVerify = useCallback(async () => {
    const response = await verify(token?.token || '');
    if (response?.ok) {
      setSuccess(true);
    } else {
      setError(response?.data.message);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      onVerify();
    }
  }, [token]);

  return (
    <div className="container">
      <Form
        className="login-form"
        form={form}
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={values => console.log(values)}
      >
        <div className="login-form-container">
          {!token ? (
            <h2>Token no válido</h2>
          ) : error ? (
            <h2>Error validando cuenta</h2>
          ) : success ? (
            <>
              <h2>Verifica tu cuenta</h2>
              <span>Cuenta verificada correctamente!</span>
              <Form.Item>
                <Row>
                  <Col span={24}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      icon={<LoginOutlined />}
                      onClick={() => form.submit()}
                    >
                      Iniciar sesión
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </>
          ) : null}
        </div>
      </Form>
    </div>
  );
};
