# TransferLy
TransferLy is a full-stack payment application designed to provide secure and efficient financial transaction services. Built using modern technologies like Express.js, React.js, MongoDB, and Node.js, TransferLy offers an intuitive user interface and robust backend infrastructure to ensure reliable performance in handling sensitive user data and transactions.

Key features of TransferLy include:

Authentication System: TransferLy implements a full-fledged authentication mechanism using JWT tokens and middleware to ensure secure user signup, signin, and session management. This approach ensures that users' sessions are maintained securely while preventing unauthorized access.

Money Transfer and Request: The core functionality of TransferLy revolves around facilitating seamless money transfers and payment requests. It utilizes MongoDB session variables to ensure that financial transactions are atomic and consistent. This guarantees that no transaction is processed partially, preventing data inconsistencies or financial discrepancies.

Settle Payment Feature: This feature provides users with a way to track and manage their financial relationships. Users can easily view how much money is owed to them or how much they owe to others, making it easy to settle debts and maintain transparent financial records.

Profile Management and Secure Logout: Users can manage their profiles within the application, update their personal information securely, and log out of the system with a seamless and secure logout mechanism.

Real-time Search with Debouncing: The search functionality is optimized using a debounced input mechanism, reducing unnecessary server requests and improving the overall user experience by delivering fast, accurate search results.
