// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// ** Axios Imports
import { useDispatch, useSelector } from 'react-redux';
import Select, { createFilter } from 'react-select';
import Select2 from '../../../../components/bootstrap/forms/Select';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Input from '../../../../components/bootstrap/forms/Input';
import showNotification from '../../../../components/extras/showNotification';
import {
	_titleSuccess,
	_titleError,
	_titleWarning,
	_titleCustom,
} from '../../../../baseURL/messages';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import baseURL from '../../../../baseURL/baseURL';


// import apiClient from '../../../../baseURL/apiClient';

// eslint-disable-next-line react/prop-types
const Categories = ({ packageName,setOpen }) => {
	const navigate = useNavigate();
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(false); 
	const data = JSON.parse(Cookies.get('Data1'));
	const endDate = data.user.subscription.end_date;
	const parts = endDate.split('-');
	const formattedDate = `${parts[1]}-${parts[2]}-${parts[0]}`;
	const currentLevel = { Basic: 1, Silver: 2, Gold: 3 }[packageName];


	const handlePackage = (id) => {
		setLoading(true);
		apiClient
		  .post('/updatePackage', { package_id: id })  
		  .then((response) => {
			if (response.data.status === "ok") {
				setLoading(false)
				setOpen(false);
				navigate(`/sparepart360/`, { replace: true });
			}
			
		  })
		  .catch((error) => {
			setLoading(false)
			console.error("Error updating package:", error);
			showNotification("Error", error.response.data?.message, "danger");
		})
			
		
	  };
	  


	useEffect(() => {
		fetch(`${baseURL}/allPackages`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((temp) => setPackages(temp.packages))
			.catch((error) => console.error('Error fetching packages:', error));
	}, []);

	return (
		<PageWrapper>
			<Page container="fluid">
				<div className="row">
					<div className="d-flex justify-content-center flex-wrap">
						{[1, 2, 3].filter(index => index > currentLevel).map(index => {
							const packageInfo = packages && packages[index];
							const defaultPrices = [5000, 8000, 10000];
							const planNames = ["Basic Plan", "Silver Plan", "Gold Plan"];
							const price = packageInfo?.price || defaultPrices[index - 1];

							let dataLimit;
							let salesmenLimit;
							if (index === 1) {
								dataLimit = "One month data";
								salesmenLimit = "Three salesmen can be created";
							} else if (index === 2) {
								dataLimit = "Three months of data";
								salesmenLimit = "Six salesmen can be created";
							} else {
								dataLimit = "One year of data";
								salesmenLimit = "Ten salesmen can be created";
							}

							return (
								<div className={`col-12 ${currentLevel === 1 ? 'col-md-6' : ''}`} key={index}>
									<div className="card mx-2" style={{ color: "black", borderRadius: "25px" }}>
										<div className="card-header" style={{ fontSize: "20px", fontWeight: "bold", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", textAlign: "left", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div>{planNames[index - 1]}</div>
											<span>{parseFloat(price).toFixed(0)} PKR</span>
										</div>
										<div className="card-body h-100 d-flex flex-column justify-content-end" style={{ backgroundColor: "#e0f3e8", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px" }}>
											<div className="text-start">
											<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Real-time data insights on your dashboard
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Efficient parts management and tracking
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Streamlined inventory operations with optimal stock levels
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Boost sales performance with tools designed to enhance customer satisfaction
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Manage product transfers seamlessly, ensuring accurate and efficient operations
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Enhance supplier management with tools to streamline communication and transactions
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Keep your store operations organized and efficient
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Handle your financial accounts effortlessly
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> Create and track vouchers accurately, ensuring seamless financial transactions
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> {dataLimit}
												</p>
												<p className="card-text" style={{ fontSize: "12px" }}>
													<span style={{ color: "green" }}>✔</span> {salesmenLimit}
												</p>
												<br />
												<Button
                                                    className="btn btn-primary w-100"
                                                    style={{ fontSize: "16px", fontWeight: "bold" }}
                                                    onClick={() => handlePackage(index+1)}
                                                    disabled={loading} 
                                                >
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        `Buy ${planNames[index - 1].split(" ")[0]}`
                                                    )}
                                                </Button>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Categories;

