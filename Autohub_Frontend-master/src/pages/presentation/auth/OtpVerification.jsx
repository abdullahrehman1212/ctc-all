import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import showNotification from '../../../components/extras/showNotification';
import Logo1 from '../../../components/logo/logo1.png';
import baseURL from '../../../baseURL/baseURL';
import { _titleSuccess, _titleError } from '../../../baseURL/messages';
import { StyledButton1 } from '../../../components/styledComponents';


const OtpVerification = () => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {email,fromRegister } = location.state || {};

    useEffect(() => {
        if (!fromRegister) {
            navigate('/auth-pages/register');
        }
    }, [navigate,fromRegister]);


    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const body = { otp,email };

        try {
            const response = await fetch(`${baseURL}/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (data?.status === 'ok') {
                showNotification(_titleSuccess, 'Email verified successfully', 'Success');
                navigate(`/sparepart360/auth-pages/login`, { replace: true });
            } else {
                showNotification(_titleError, data.message, 'Danger');
            }
        } catch (error) {
            showNotification(_titleError, 'Network error. Please try again.', 'Danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapper title="OTP Verification" className="bg-dark">
            <Page className="p-3">
                <div className="row h-100 align-items-center justify-content-center">
                    <div className="col-xl-6 col-lg-5 col-md-6 shadow-3d-container">
                        <Card className="shadow-3d-light">
                            <CardBody>
                            <div className='text-center my-4'>
									<img alt='Logo' src={Logo1} width={300} />
								</div>
                                <div className="text-center my-4">
                                    <h3 className='fw-bold' style={{ color: 'red' }}>Verify Your Email</h3>
                                    <p>Enter the OTP sent to your email</p>
                                </div>
                                <form onSubmit={handleOtpSubmit} className="row g-3">
                                <div className='col-12'>
                                    <FormGroup id="otp-input" label="OTP" isFloating>
                                        <Input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </FormGroup>
                                    </div>
                                    <div className='col-12'>
										<StyledButton1
											className='w-100 py-3'
											onClick={handleOtpSubmit}
                                            disabled={isLoading}>
											{isLoading ? 'Verifying...' : 'Verify OTP'}
                                              
										</StyledButton1>
									</div>
                         
                                </form>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Page>
        </PageWrapper>
    );
};

export default OtpVerification;
