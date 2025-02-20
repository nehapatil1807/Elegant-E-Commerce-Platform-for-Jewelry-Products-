package com.cdac.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.cdac.exception.OrderException;
import com.cdac.exception.UserException;
import com.cdac.modal.Order;
import com.cdac.modal.User;
import com.cdac.repository.OrderRepository;
import com.cdac.response.ApiResponse;
import com.cdac.response.PaymentLinkResponse;
import com.cdac.service.OrderService;
import com.cdac.service.UserService;
import com.cdac.user.domain.OrderStatus;
import com.cdac.user.domain.PaymentStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/api")
public class PaymentController {
	
	   @Value("${razorpay.api.key}")
	    private String apiKey;

	    @Value("${razorpay.api.secret}")
	    private String apiSecret;
	
	private OrderService orderService;
	private UserService userService;
	private OrderRepository orderRepository;
	
	public PaymentController(OrderService orderService,UserService userService,OrderRepository orderRepository) {
		this.orderService=orderService;
		this.userService=userService;
		this.orderRepository=orderRepository;
	}
	
	@PostMapping("/payments/{orderId}")
	public ResponseEntity<PaymentLinkResponse>createPaymentLink(@PathVariable Long orderId,
			@RequestHeader("Authorization")String jwt) 
					throws RazorpayException, UserException, OrderException{
		
		Order order=orderService.findOrderById(orderId);
		 try {
		      // Instantiate a Razorpay client with your key ID and secret
		      RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

		      // Create a JSON object with the payment link request parameters
		      JSONObject paymentLinkRequest = new JSONObject();
		      paymentLinkRequest.put("amount",order.getTotalDiscountedPrice()*100);
		      paymentLinkRequest.put("currency","INR");    
//		      paymentLinkRequest.put("expire_by",1691097057);
//		      paymentLinkRequest.put("reference_id",order.getId().toString());
		     

		      // Create a JSON object with the customer details
		      JSONObject customer = new JSONObject();
		      customer.put("name",order.getUser().getFirstName()+" "+order.getUser().getLastName());
		      customer.put("contact",order.getUser().getMobile());
		      customer.put("email",order.getUser().getEmail());
		      paymentLinkRequest.put("customer",customer);

		      // Create a JSON object with the notification settings
		      JSONObject notify = new JSONObject();
		      notify.put("sms",true);
		      notify.put("email",true);
		      paymentLinkRequest.put("notify",notify);

		      // Set the reminder settings
		      paymentLinkRequest.put("reminder_enable",true);

		      // Set the callback URL and method
		      paymentLinkRequest.put("callback_url","http://localhost:3000/payment-success?order_id="+orderId);
		    //  paymentLinkRequest.put("callback_url","http://elegantjewellary.vercel.app/payment-success?order_id="+orderId);
		      paymentLinkRequest.put("callback_method","get");

		      // Create the payment link using the paymentLink.create() method
		      PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);
		      
		      String paymentLinkId = payment.get("id");
		      String paymentLinkUrl = payment.get("short_url");
		      
		      PaymentLinkResponse res=new PaymentLinkResponse(paymentLinkUrl,paymentLinkId);
		      
		      PaymentLink fetchedPayment = razorpay.paymentLink.fetch(paymentLinkId);
		      
		      order.setOrderId(fetchedPayment.get("order_id"));
		      orderRepository.save(order);
		      
		   // Print the payment link ID and URL
		      System.out.println("Payment link ID: " + paymentLinkId);
		      System.out.println("Payment link URL: " + paymentLinkUrl);
		      System.out.println("Order Id : "+fetchedPayment.get("order_id")+fetchedPayment);
		      
		      return new ResponseEntity<PaymentLinkResponse>(res,HttpStatus.ACCEPTED);
		      
		    } catch (RazorpayException e) {
		    	
		      System.out.println("Error creating payment link: " + e.getMessage());
		      throw new RazorpayException(e.getMessage());
		    }
		
		
//		order_id
	}
	
	@GetMapping("/payments")
	public ResponseEntity<ApiResponse> redirect(@RequestParam(name="payment_id") String paymentId, 
	                                            @RequestParam("order_id") Long orderId) throws RazorpayException, OrderException {
	    System.out.println("Received request for payment status with payment_id: " + paymentId + " and order_id: " + orderId);
	    
	    RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
	    Order order = orderService.findOrderById(orderId);
	    
	    try {
	        Payment payment = razorpay.payments.fetch(paymentId);
	        System.out.println("Payment details: " + payment.toString());

	        if (payment.get("status").equals("captured")) {
	            order.getPaymentDetails().setPaymentId(paymentId);
	            order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
	            order.setOrderStatus(OrderStatus.PLACED);
	            
	            orderRepository.save(order);
	            System.out.println("Order successfully updated with payment status: " + order.getPaymentDetails().getStatus());
	        }

	        ApiResponse res = new ApiResponse("Your order has been placed successfully", true);
	        return new ResponseEntity<>(res, HttpStatus.OK);
	    } catch (Exception e) {
	        System.out.println("Error fetching payment details: " + e.getMessage());
	        return new ResponseEntity<>(new ApiResponse("Failed to verify payment", false), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}
