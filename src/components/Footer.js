import Image from "next/image";

const Footer = () => {

    return (
        <footer
            className='bg-black p-10 font-mono text-gray-200 text-xs'
        >
            <div
                className='flex flex-col space-y-2'
            >
                <h2
                className="text-lg"
                >About Us - ROBES</h2>
                <p>At ROBES, we believe that a successful workday begins with confidence, comfort, and style. We are a premier workwear brand specializing in designing and crafting high-quality shirts exclusively for professionals. Our mission is to empower individuals to look and feel their best, allowing them to excel in their careers and leave a lasting impression.

                    Quality is at the core of everything we do. Each ROBES shirt is meticulously crafted using the finest fabrics and materials, ensuring durability and a polished appearance that withstands the demands of the modern workplace. Our attention to detail, from precise stitching to tailored fits, sets us apart and guarantees a garment that exudes professionalism.

                    We understand that workwear should not only be functional but also a reflection of personal style. That's why our design team is committed to creating shirts that blend classic elegance with contemporary trends. Whether you prefer a timeless solid color or a subtle pattern, our diverse collection offers a range of options to suit every individual's taste and professional environment.

                </p><br /><p>Comfort is another aspect we prioritize in our shirt designs. We believe that when you feel comfortable in your attire, it enhances your confidence and allows you to focus on the task at hand. Our shirts are carefully constructed to provide an impeccable fit and freedom of movement, ensuring all-day comfort without compromising on style.

                    At ROBES, we value sustainability and ethical practices. We strive to minimize our environmental impact by using eco-friendly materials and adopting responsible manufacturing processes. We also prioritize fair trade and collaborate with suppliers who uphold ethical standards, ensuring that our shirts are not only exceptional in quality but also in their commitment to a better future.

                    Our dedication to customer satisfaction is unwavering. We aim to provide an exceptional shopping experience from start to finish. Our knowledgeable and friendly customer service team is always ready to assist you with any inquiries, ensuring that you find the perfect shirt that meets your specific needs.

                    We believe that your workwear should be an investment in your professional success. With ROBES, you can rely on exceptional craftsmanship, timeless style, and unparalleled comfort. Elevate your work wardrobe and make a lasting impression with our exclusive collection of shirts designed to empower you in every aspect of your career.

                    Choose ROBES. Embrace Confidence. Excel Professionally.</p>
                <div
                    className='flex flex-col justify-end items-end'
                >
                   <h1>CONNECT WITH US</h1> 
                    <div
                        className='flex flex-row space-x-2'
                    >

                        <a
                            href='https://www.facebook.com'
                        >
                            <Image
                                className="text-gray-200"
                                src="https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/icons8-facebook-50%20(2).png?alt=media&token=b349c97d-be18-43e9-ae06-e772a007d4a8&_gl=1*p31rjc*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjA1MjE2NC4zNC4xLjE2ODYwNTUwMTYuMC4wLjA."
                                height={20}
                                width={20}
                            />
                        </a>
                        <a
                            href='https://www.instagram.com'
                        >
                            <Image
                                className="text-gray-200"
                                src="https://firebasestorage.googleapis.com/v0/b/project-1234-1a50f.appspot.com/o/icons8-instagram-50%20(1).png?alt=media&token=a913e8cf-b560-4d88-9c30-78e825adc62c&_gl=1*1vj0oag*_ga*MTM0MDY1NzUzOS4xNjgxNTU4Mjky*_ga_CW55HF8NVT*MTY4NjA1MjE2NC4zNC4xLjE2ODYwNTQ2OTcuMC4wLjA."
                                height={20}
                                width={20}
                            />
                        </a>
                    </div>
                </div>

            </div>

        </footer>
    );

}

export default Footer
