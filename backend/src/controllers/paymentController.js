const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User"); 

// Razorpay Instance 
const razorpay = new Razorpay({
  key_id: "rzp_test_YourKeyID", 
  key_secret: "YourKeySecret",
});


exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; 

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) return res.status(500).send("Order creation failed");

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const studentId = req.user.id; // Auth middleware 

    // Signature verification logic (Security check)
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "YourKeySecret")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      const student = await User.findById(studentId);
      if (!student.enrolledCourses.includes(courseId)) {
        student.enrolledCourses.push(courseId);
        await student.save();
      }
      return res.json({ success: true, message: "Payment Verified & Enrolled" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

exports.freeEnroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id; // From protect middleware

    const student = await User.findById(studentId);
    
    // Check if already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ success: false, message: "Already enrolled in this course" });
    }

    student.enrolledCourses.push(courseId);
    await student.save();

    res.json({ success: true, message: "Successfully enrolled!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};