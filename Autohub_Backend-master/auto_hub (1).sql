-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 17, 2024 at 01:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auto_hub`
--

-- --------------------------------------------------------

--
-- Table structure for table `adjust_inventories`
--

CREATE TABLE `adjust_inventories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `adjust_no` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `adjust_type` varchar(255) DEFAULT NULL,
  `total_amount` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adjust_inventories`
--

INSERT INTO `adjust_inventories` (`id`, `adjust_no`, `user_id`, `store_id`, `remarks`, `adjust_type`, `total_amount`, `date`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '3000001', 14, 12, NULL, 'add', 3595, '2024-12-17', NULL, '2024-12-17 09:38:36', '2024-12-17 09:38:36'),
(2, '3000002', 14, 12, NULL, 'remove', 460, '2024-12-17', NULL, '2024-12-17 09:42:37', '2024-12-17 09:42:37'),
(3, '3000003', 14, 12, '4', 'add', 625, '2024-12-17', NULL, '2024-12-17 12:07:07', '2024-12-17 12:07:07'),
(4, '3000004', 14, 12, NULL, 'add', 25, '2024-12-17', NULL, '2024-12-17 12:50:31', '2024-12-17 12:50:31');

-- --------------------------------------------------------

--
-- Table structure for table `adjust_inventory_children`
--

CREATE TABLE `adjust_inventory_children` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `adjust_inventory_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity_in` double NOT NULL DEFAULT 0,
  `quantity_out` double NOT NULL DEFAULT 0,
  `purchase_price` double NOT NULL DEFAULT 0,
  `total` double NOT NULL DEFAULT 0,
  `cost` double DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adjust_inventory_children`
--

INSERT INTO `adjust_inventory_children` (`id`, `user_id`, `adjust_inventory_id`, `item_id`, `quantity_in`, `quantity_out`, `purchase_price`, `total`, `cost`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 14, 1, 534, 10, 0, 102, 1020, 2754.4, '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL),
(2, 14, 1, 534, 25, 0, 103, 2575, 2754.4, '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL),
(3, 14, 2, 534, 0, 10, 25, 250, 1207.5833333333, '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL),
(4, 14, 2, 534, 0, 10, 21, 210, 1207.5833333333, '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL),
(5, 14, 3, 534, 25, 0, 25, 625, 1799.875, '2024-12-17 12:07:07', '2024-12-17 12:07:07', NULL),
(6, 14, 4, 534, 5, 0, 5, 25, 791.42329545455, '2024-12-17 12:50:31', '2024-12-17 12:50:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `name`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'WHEEL PARTS', 3, '2024-09-08 05:44:11', '2024-09-08 05:44:11'),
(2, 'SWING MOTOR', 3, '2024-09-09 11:59:19', '2024-09-09 11:59:19'),
(3, 'JACK SEAL KITS', 3, '2024-09-11 10:59:26', '2024-09-11 10:59:26'),
(4, 'MAIN PUMP', 3, '2024-09-11 11:22:11', '2024-09-11 11:22:11'),
(5, 'ENGINE PARTS', 3, '2024-09-14 13:23:16', '2024-09-14 13:23:16'),
(6, 'LUBRICANTS', 3, '2024-09-22 04:57:54', '2024-09-22 04:57:54'),
(7, 'HOUSING', 3, '2024-09-24 05:24:15', '2024-09-24 05:24:15'),
(8, 'HYDRAULIC', 3, '2024-10-14 05:03:25', '2024-10-14 05:03:25'),
(9, 'body', 11, '2024-10-17 08:08:49', '2024-10-17 08:08:49'),
(10, 'BODY', 11, '2024-10-18 05:22:22', '2024-10-18 05:22:22'),
(11, 'BODY', 19, '2024-10-18 08:09:45', '2024-10-18 08:09:45'),
(12, 'HAMMER', 3, '2024-10-19 11:24:24', '2024-10-19 11:24:24'),
(13, 'pisiton ring', 27, '2024-10-28 12:12:43', '2024-10-28 12:12:43'),
(14, 'df', 14, '2024-12-17 09:18:23', '2024-12-17 09:18:23');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'Seal Group', '2024-07-09 08:20:10', '2024-07-09 08:20:10', 3),
(3, 'PARTS', '2024-07-09 09:14:57', '2024-07-09 09:14:57', 3),
(4, 'LUBRICANTS', '2024-07-09 09:17:45', '2024-07-09 09:17:45', 3),
(5, 'ELECTRIC', '2024-07-09 10:42:14', '2024-07-09 10:42:14', 3),
(6, 'FILTER', '2024-07-10 11:39:51', '2024-07-10 11:39:51', 3),
(10, 'Body', '2024-08-05 08:33:04', '2024-08-05 08:33:04', 6),
(11, 'Parts', '2024-08-12 09:45:32', '2024-08-12 09:45:32', 6),
(12, 'categorytest', '2024-08-22 10:44:17', '2024-08-22 10:44:17', 8),
(13, 'Engine', '2024-08-26 06:47:53', '2024-08-26 06:47:53', 10),
(15, '41588558', '2024-08-30 10:55:17', '2024-08-30 10:55:17', 13),
(16, 'Suv cars', '2024-10-13 17:28:23', '2024-10-13 17:28:23', 11),
(17, 'Front', '2024-10-17 05:49:05', '2024-10-17 05:49:05', 11),
(18, 'body', '2024-10-17 08:09:17', '2024-10-17 08:09:17', 11),
(19, 'body', '2024-10-17 08:09:39', '2024-10-17 08:09:39', 11),
(20, 'BODY', '2024-10-18 05:18:19', '2024-10-18 05:18:19', 11),
(21, 'BODY', '2024-10-18 08:09:00', '2024-10-18 08:09:00', 19),
(22, 'engine parts', '2024-10-28 12:07:30', '2024-10-28 12:07:30', 27),
(23, 'engine parts', '2024-10-28 12:10:22', '2024-10-28 12:10:22', 27),
(24, 'Pisiton ring', '2024-10-28 12:11:23', '2024-10-28 12:11:23', 27),
(25, 'bf', '2024-12-17 09:17:48', '2024-12-17 09:17:48', 14);

-- --------------------------------------------------------

--
-- Table structure for table `coa_accounts`
--

CREATE TABLE `coa_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` int(11) DEFAULT NULL,
  `coa_group_id` int(11) NOT NULL,
  `coa_sub_group_id` int(11) NOT NULL DEFAULT 0,
  `person_id` bigint(20) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `dep_percentage` double NOT NULL DEFAULT 0,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `isDefault` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coa_accounts`
--

INSERT INTO `coa_accounts` (`id`, `user_id`, `name`, `code`, `coa_group_id`, `coa_sub_group_id`, `person_id`, `type`, `description`, `dep_percentage`, `isActive`, `isDefault`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Inventory', 101001, 1, 1, NULL, NULL, 'Inventory', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(3, NULL, 'Cost Inventory', 901001, 9, 3, NULL, NULL, 'Cost Inventory', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(4, NULL, 'Goods Sold', 701001, 7, 4, NULL, NULL, 'Goods Sold', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(23, NULL, 'GST', 401001, 4, 10, NULL, NULL, 'GST', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(27, NULL, 'Cost Inventory (Discounts)', 901002, 9, 3, NULL, NULL, 'Cost Inventory (Discounts)', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(28, NULL, 'Goods Sold (Discounts)', 701002, 7, 4, NULL, NULL, 'Goods Sold (Discounts)', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(30, NULL, 'Purchase Tax Expense', 801002, 8, 7, NULL, NULL, 'Purchase Tax Expense', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(31, NULL, 'Purchase Tax Payable', 401002, 4, 10, NULL, NULL, 'Purchase Tax Payable', 0, 1, 1, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(121, 4, 'Inventory', 101001, 1, 1, NULL, NULL, 'Inventory', 0, 1, 0, NULL, NULL),
(122, 4, 'Cost Inventory', 901001, 9, 3, NULL, NULL, 'Cost Inventory', 0, 1, 0, NULL, NULL),
(123, 4, 'Goods Sold', 701001, 7, 4, NULL, NULL, 'Goods Sold', 0, 1, 0, NULL, NULL),
(124, 4, 'GST', 401001, 4, 10, NULL, NULL, 'GST', 0, 1, 0, NULL, NULL),
(125, 4, 'Cost Inventory (Discounts)', 901002, 9, 3, NULL, NULL, 'Cost Inventory (Discounts)', 0, 1, 0, NULL, NULL),
(126, 4, 'Goods Sold (Discounts)', 701002, 7, 4, NULL, NULL, 'Goods Sold (Discounts)', 0, 1, 0, NULL, NULL),
(127, 4, 'Purchase Tax Expense', 801002, 8, 7, NULL, NULL, 'Purchase Tax Expense', 0, 1, 0, NULL, NULL),
(128, 4, 'Purchase Tax Payable', 401002, 4, 10, NULL, NULL, 'Purchase Tax Payable', 0, 1, 0, NULL, NULL),
(129, 5, 'Inventory', 101001, 1, 1, NULL, NULL, 'Inventory', 0, 1, 0, NULL, NULL),
(130, 5, 'Cost Inventory', 901001, 9, 3, NULL, NULL, 'Cost Inventory', 0, 1, 0, NULL, NULL),
(131, 5, 'Goods Sold', 701001, 7, 4, NULL, NULL, 'Goods Sold', 0, 1, 0, NULL, NULL),
(132, 5, 'GST', 401001, 4, 10, NULL, NULL, 'GST', 0, 1, 0, NULL, NULL),
(133, 5, 'Cost Inventory (Discounts)', 901002, 9, 3, NULL, NULL, 'Cost Inventory (Discounts)', 0, 1, 0, NULL, NULL),
(134, 5, 'Goods Sold (Discounts)', 701002, 7, 4, NULL, NULL, 'Goods Sold (Discounts)', 0, 1, 0, NULL, NULL),
(135, 5, 'Purchase Tax Expense', 801002, 8, 7, NULL, NULL, 'Purchase Tax Expense', 0, 1, 0, NULL, NULL),
(136, 5, 'Purchase Tax Payable', 401002, 4, 10, NULL, NULL, 'Purchase Tax Payable', 0, 1, 0, NULL, NULL),
(137, 6, 'Inventory', 101001, 1, 1, NULL, NULL, 'Inventory', 0, 1, 0, NULL, NULL),
(138, 6, 'Cost Inventory', 901001, 9, 3, NULL, NULL, 'Cost Inventory', 0, 1, 0, NULL, NULL),
(139, 6, 'Goods Sold', 701001, 7, 4, NULL, NULL, 'Goods Sold', 0, 1, 0, NULL, NULL),
(140, 6, 'GST', 401001, 4, 10, NULL, NULL, 'GST', 0, 1, 0, NULL, NULL),
(141, 6, 'Cost Inventory (Discounts)', 901002, 9, 3, NULL, NULL, 'Cost Inventory (Discounts)', 0, 1, 0, NULL, NULL),
(142, 6, 'Goods Sold (Discounts)', 701002, 7, 4, NULL, NULL, 'Goods Sold (Discounts)', 0, 1, 0, NULL, NULL),
(143, 6, 'Purchase Tax Expense', 801002, 8, 7, NULL, NULL, 'Purchase Tax Expense', 0, 1, 0, NULL, NULL),
(144, 6, 'Purchase Tax Payable', 401002, 4, 10, NULL, NULL, 'Purchase Tax Payable', 0, 1, 0, NULL, NULL),
(151, 6, '22 Number', 801003, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-07-29 11:08:45', '2024-07-29 11:08:45'),
(152, 6, '22 Number', 302002, 3, 8, NULL, NULL, NULL, 0, 1, 0, '2024-07-29 11:10:16', '2024-07-29 11:10:16'),
(153, 6, 'Cash', 102002, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-07-29 11:24:21', '2024-07-29 11:24:21'),
(154, 6, 'Allied Bank Limited Ali Amin', 103005, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-07-29 11:38:49', '2024-07-29 11:38:49'),
(168, 6, 'Bilti Cost', 302003, 3, 8, NULL, NULL, NULL, 0, 1, 0, '2024-08-06 10:40:53', '2024-08-06 10:40:53'),
(171, 6, 'EasyPaisa', 103006, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-07 12:03:50', '2024-08-07 12:03:50'),
(172, 6, 'Jazz Cash', 103007, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-07 12:04:34', '2024-08-07 12:04:34'),
(173, 6, 'EasyPaisa', 103008, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-09 06:53:14', '2024-08-09 06:53:14'),
(174, 6, 'Meezan Bank', 103009, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-09 07:03:20', '2024-08-09 07:03:20'),
(175, 6, 'for personal use', 602001, 6, 44, NULL, NULL, NULL, 0, 1, 0, '2024-08-09 07:08:02', '2024-08-09 07:08:02'),
(176, 6, 'Bank Alfalah', 103010, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-09 07:21:49', '2024-08-09 07:21:49'),
(177, 6, 'Shop Furniture', 201001, 2, 45, NULL, NULL, NULL, 0, 1, 0, '2024-08-09 07:23:49', '2024-08-09 07:23:49'),
(182, NULL, 'OWNER CAPITAL', 501003, 5, 12, NULL, NULL, 'OWNER CAPITAL', 0, 1, 0, '2024-08-22 10:47:07', '2024-08-22 10:47:07'),
(183, NULL, 'Dispose Inventory', 801014, 8, 7, NULL, NULL, 'Dispose Inventory', 0, 1, 0, '2024-12-17 09:12:28', '2024-12-17 09:12:28'),
(186, 8, 'cash 1', 102003, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-08-22 11:00:35', '2024-08-22 11:00:35'),
(187, 8, 'Faysal bank', 103011, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-22 11:00:54', '2024-08-22 11:00:54'),
(188, 8, 'payabletest', 801004, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-08-22 11:09:20', '2024-08-22 11:09:20'),
(189, 8, 'payableexpansetest', 302004, 3, 8, NULL, NULL, NULL, 0, 1, 0, '2024-08-22 11:10:59', '2024-08-22 11:10:59'),
(191, 10, 'my cash', 102004, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-08-26 09:48:20', '2024-08-26 09:48:20'),
(192, 10, 'my bank', 103012, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-08-26 09:48:42', '2024-08-26 09:48:42'),
(197, 13, 'defsg', 102006, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-08-30 11:01:59', '2024-08-30 11:01:59'),
(198, 3, 'Kashif Equity', 501004, 5, 12, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 11:10:32', '2024-09-01 11:10:32'),
(199, 3, 'Mubashir Equity', 502001, 5, 30, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 11:11:06', '2024-09-01 11:11:06'),
(200, 3, 'Daniyal Equity', 503001, 5, 46, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 11:16:02', '2024-09-01 11:16:02'),
(201, 3, 'Cash In Hand', 102007, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 11:43:32', '2024-09-01 11:43:32'),
(202, 3, 'Meezan Bank', 103013, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 11:44:05', '2024-09-01 11:44:05'),
(203, 3, 'Shop Security', 202001, 2, 47, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:02:37', '2024-09-01 12:02:37'),
(204, 3, 'Shop GoodWell', 202002, 2, 47, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:03:15', '2024-09-01 12:03:15'),
(205, 3, 'Shop Rent', 809001, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:08:48', '2024-09-01 12:08:48'),
(206, 3, 'Electricity Bill', 809002, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:09:25', '2024-09-01 12:09:25'),
(207, 3, 'Mobile Bill', 809003, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:10:11', '2024-09-01 12:10:11'),
(208, 3, 'Internet Bill', 809004, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:10:50', '2024-09-01 12:10:50'),
(209, 3, 'Drinking Water', 809005, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:11:22', '2024-09-01 12:11:22'),
(210, 3, 'Food', 809006, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:11:51', '2024-09-01 12:11:51'),
(211, 3, 'Faqeer Expance', 809007, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:13:01', '2024-09-01 12:13:01'),
(212, 3, 'MISC', 809008, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:13:28', '2024-09-01 12:13:28'),
(213, 3, 'Sallery', 809009, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:14:33', '2024-09-01 12:14:33'),
(214, 3, 'Daniyal Salery', 810001, 8, 49, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:16:46', '2024-09-01 12:16:46'),
(215, 3, 'Daniyal Loan', 107001, 1, 40, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:19:46', '2024-09-01 12:19:46'),
(216, 3, 'Kashif Loan', 107002, 1, 40, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:20:23', '2024-09-01 12:20:23'),
(217, 3, 'Mubashir Loan', 107003, 1, 40, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:20:58', '2024-09-01 12:20:58'),
(218, 3, 'Kabir Loan', 107004, 1, 40, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 12:21:28', '2024-09-01 12:21:28'),
(219, 3, 'GEO IMPEX (S)', 301037, 3, 2, 1, NULL, 'GEO IMPEX (S)', 0, 1, 1, '2024-09-01 12:24:30', '2024-09-01 12:24:30'),
(220, 3, 'HAMDAN AUTO (S)', 301038, 3, 2, 2, NULL, 'HAMDAN AUTO (S)', 0, 1, 1, '2024-09-01 12:25:36', '2024-09-01 12:25:36'),
(221, 3, 'LUQMAN AFRIDI (S)', 301039, 3, 2, 3, NULL, 'LUQMAN AFRIDI (S)', 0, 1, 1, '2024-09-01 12:26:06', '2024-09-01 12:26:06'),
(222, 3, 'Books & Cards', 809010, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-01 13:00:39', '2024-09-01 13:00:39'),
(223, 3, 'AWAIS (S)', 301040, 3, 2, 4, NULL, 'AWAIS (S)', 0, 1, 1, '2024-09-02 08:41:41', '2024-09-02 08:41:41'),
(224, 3, 'KASHIF (S)', 301041, 3, 2, 5, NULL, 'KASHIF (S)', 0, 1, 1, '2024-09-02 08:50:48', '2024-09-02 08:50:48'),
(225, 3, 'LUCKY TRADERS (S)', 301042, 3, 2, 6, NULL, 'LUCKY TRADERS (S)', 0, 1, 1, '2024-09-02 08:51:20', '2024-09-02 08:51:20'),
(226, 3, 'ZAHORE ELECTRITION (S)', 301043, 3, 2, 7, NULL, 'ZAHORE ELECTRITION (S)', 0, 1, 1, '2024-09-02 09:29:48', '2024-09-02 09:29:48'),
(227, 3, 'YOUNAS AYUB&CO (S)', 301044, 3, 2, 8, NULL, 'YOUNAS AYUB&CO (S)', 0, 1, 1, '2024-09-02 10:13:51', '2024-09-02 10:13:51'),
(228, 3, 'MAMA AKRAM LAHORE (S)', 301045, 3, 2, 9, NULL, 'MAMA AKRAM LAHORE (S)', 0, 1, 1, '2024-09-02 11:22:24', '2024-09-02 11:22:24'),
(229, 3, 'SWATTI AUTOS (S)', 301046, 3, 2, 10, NULL, 'SWATTI AUTOS (S)', 0, 1, 1, '2024-09-02 11:40:55', '2024-09-02 11:40:55'),
(230, 3, 'ALI (S)', 301047, 3, 2, 11, NULL, 'ALI (S)', 0, 1, 1, '2024-09-02 12:09:15', '2024-09-02 12:09:15'),
(231, 3, 'ADNAN BERING (S)', 301048, 3, 2, 12, NULL, 'ADNAN BERING (S)', 0, 1, 1, '2024-09-02 12:40:30', '2024-09-02 12:40:30'),
(232, 3, 'AMC TRADING COMPANY (S)', 301049, 3, 2, 13, NULL, 'AMC TRADING COMPANY (S)', 0, 1, 1, '2024-09-03 09:05:33', '2024-09-03 09:05:33'),
(233, 3, 'Carrige Expance', 801005, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-09-03 09:23:26', '2024-09-03 09:23:26'),
(234, 3, 'Carriage Charges (P)', 302005, 3, 8, NULL, NULL, NULL, 0, 1, 0, '2024-09-03 09:43:50', '2024-09-03 09:43:50'),
(235, 3, 'IRFAN BROTHER (S)', 301050, 3, 2, 14, NULL, 'IRFAN BROTHER (S)', 0, 1, 1, '2024-09-03 10:03:07', '2024-09-03 10:03:07'),
(236, 3, 'ASIF DOOSAN AUTO (S)', 301051, 3, 2, 15, NULL, 'ASIF DOOSAN AUTO (S)', 0, 1, 1, '2024-09-03 11:58:45', '2024-09-03 11:58:45'),
(237, 3, 'TEHSEEN AYUB&CO (S)', 301052, 3, 2, 16, NULL, 'TEHSEEN AYUB&CO (S)', 0, 1, 1, '2024-09-04 06:27:21', '2024-09-04 06:27:21'),
(238, 3, 'SADAM (S)', 301053, 3, 2, 17, NULL, 'SADAM (S)', 0, 1, 1, '2024-09-04 06:31:59', '2024-09-04 06:31:59'),
(239, 3, 'INSAAF AUTO (S)', 301054, 3, 2, 18, NULL, 'INSAAF AUTO (S)', 0, 1, 1, '2024-09-04 07:05:56', '2024-09-04 07:05:56'),
(240, 3, 'QISMAT WAZEER (S)', 301055, 3, 2, 19, NULL, 'QISMAT WAZEER (S)', 0, 1, 1, '2024-09-04 08:12:50', '2024-09-04 08:12:50'),
(241, 3, 'REHMAT BUSH & BOLTS', 301056, 3, 2, 20, NULL, 'REHMAT BUSH & BOLTS', 0, 1, 1, '2024-09-04 12:03:55', '2024-09-04 12:03:55'),
(243, 3, 'PEHELWAN TRADER (S)', 301057, 3, 2, 22, NULL, 'PEHELWAN TRADER (S)', 0, 1, 1, '2024-09-04 12:13:06', '2024-09-04 12:13:06'),
(244, 3, 'CHOUDRY INTERPRISES (S)', 301058, 3, 2, 23, NULL, 'CHOUDRY INTERPRISES (S)', 0, 1, 1, '2024-09-04 12:33:48', '2024-09-04 12:33:48'),
(246, 3, 'MH TRADER (S)', 301059, 3, 2, 25, NULL, 'MH TRADER (S)', 0, 1, 1, '2024-09-04 12:56:10', '2024-09-04 12:56:10'),
(247, 3, 'RAHEEM INTERPRISES GJW (C)', 104019, 1, 9, 26, NULL, 'RAHEEM INTERPRISES GJW (C)', 0, 1, 1, '2024-09-04 13:22:28', '2024-09-04 13:22:28'),
(248, 3, 'HAMDAN AUTO (C)', 104020, 1, 9, 27, NULL, 'HAMDAN AUTO (C)', 0, 1, 1, '2024-09-04 13:28:19', '2024-09-04 13:28:19'),
(249, 3, 'LUCKY TRADERS (C)', 104021, 1, 9, 28, NULL, 'LUCKY TRADERS (C)', 0, 1, 1, '2024-09-04 13:34:48', '2024-09-04 13:34:48'),
(250, 3, 'SHAMS AUTO (S)', 301060, 3, 2, 29, NULL, 'SHAMS AUTO (S)', 0, 1, 1, '2024-09-05 04:47:35', '2024-09-05 04:47:35'),
(251, 3, 'BABA ALHAIDER (S)', 301061, 3, 2, 30, NULL, 'BABA ALHAIDER (S)', 0, 1, 1, '2024-09-05 04:52:33', '2024-09-05 04:52:33'),
(252, 3, 'INAAM KHAN (S)', 301062, 3, 2, 31, NULL, 'INAAM KHAN (S)', 0, 1, 1, '2024-09-05 04:55:18', '2024-09-05 04:55:18'),
(253, 3, 'QADIR BHAI (S)', 301063, 3, 2, 32, NULL, 'QADIR BHAI (S)', 0, 1, 1, '2024-09-05 07:50:25', '2024-09-05 07:50:25'),
(254, 3, 'NOOR KHAN (S)', 301064, 3, 2, 33, NULL, 'NOOR KHAN (S)', 0, 1, 1, '2024-09-05 08:22:24', '2024-09-05 08:22:24'),
(255, 3, 'ALI RIZWAN FILTER (S)', 301065, 3, 2, 34, NULL, 'ALI RIZWAN FILTER (S)', 0, 1, 1, '2024-09-05 08:29:35', '2024-09-05 08:29:35'),
(256, 3, 'USAMA BELT STORE (S)', 301066, 3, 2, 35, NULL, 'USAMA BELT STORE (S)', 0, 1, 1, '2024-09-05 08:32:13', '2024-09-05 08:32:13'),
(257, 3, 'BAKHT MEER ZADA (S)', 301067, 3, 2, 36, NULL, 'BAKHT MEER ZADA (S)', 0, 1, 1, '2024-09-05 08:59:43', '2024-09-05 08:59:43'),
(258, 3, 'ALI (C)', 104022, 1, 9, 37, NULL, 'ALI (C)', 0, 1, 1, '2024-09-07 04:49:21', '2024-09-07 04:49:21'),
(259, 3, 'QARI SIFAT (S)', 301068, 3, 2, 38, NULL, 'QARI SIFAT (S)', 0, 1, 1, '2024-09-07 05:52:04', '2024-09-07 05:52:04'),
(260, 3, 'HAROON BHAI (S)', 301069, 3, 2, 39, NULL, 'HAROON BHAI (S)', 0, 1, 1, '2024-09-07 08:13:51', '2024-09-07 08:13:51'),
(261, 3, 'SHAIR QAYOOM (S)', 301070, 3, 2, 40, NULL, 'SHAIR QAYOOM (S)', 0, 1, 1, '2024-09-07 09:01:22', '2024-09-07 09:01:22'),
(262, 3, 'ABDULLAH AUTOZ (S)', 301071, 3, 2, 41, NULL, 'ABDULLAH AUTOZ (S)', 0, 1, 1, '2024-09-07 09:42:05', '2024-09-07 09:42:05'),
(263, 3, 'MARDAN AUTO (S)', 301072, 3, 2, 42, NULL, 'MARDAN AUTO (S)', 0, 1, 1, '2024-09-07 10:00:56', '2024-09-07 10:00:56'),
(264, 3, 'QAZ IMPEX (S)', 301073, 3, 2, 43, NULL, 'QAZ IMPEX (S)', 0, 1, 1, '2024-09-07 12:42:32', '2024-09-07 12:42:32'),
(265, 3, 'SWATTI AUTOS (C)', 104023, 1, 9, 44, NULL, 'SWATTI AUTOS (C)', 0, 1, 1, '2024-09-07 13:19:13', '2024-09-07 13:19:13'),
(266, 3, 'FARHAN WATER BODY (S)', 301074, 3, 2, 45, NULL, 'FARHAN WATER BODY (S)', 0, 1, 1, '2024-09-08 05:46:34', '2024-09-08 05:46:34'),
(267, 3, 'ASLAM LAHORE (S)', 301075, 3, 2, 46, NULL, 'ASLAM LAHORE (S)', 0, 1, 1, '2024-09-09 12:24:13', '2024-09-09 12:24:13'),
(268, 3, 'AWAIS OLD PARTS (S)', 301076, 3, 2, 47, NULL, 'AWAIS OLD PARTS (S)', 0, 1, 1, '2024-09-09 13:25:44', '2024-09-09 13:25:44'),
(269, 3, 'FAZAL MUQEEM (S)', 301077, 3, 2, 48, NULL, 'FAZAL MUQEEM (S)', 0, 1, 1, '2024-09-10 06:05:41', '2024-09-10 06:05:41'),
(270, 3, 'KHURAM WAH (S)', 301078, 3, 2, 49, NULL, 'KHURAM WAH (S)', 0, 1, 1, '2024-09-10 06:15:15', '2024-09-10 06:15:15'),
(271, 3, 'SHEHZAD DOOSAN (C)', 104024, 1, 9, 50, NULL, 'SHEHZAD DOOSAN (C)', 0, 1, 1, '2024-09-10 06:46:51', '2024-09-10 06:46:51'),
(272, 3, 'NAZEER OSTAD (C)', 104025, 1, 9, 51, NULL, 'NAZEER OSTAD (C)', 0, 1, 1, '2024-09-10 07:24:48', '2024-09-10 07:24:48'),
(273, 3, 'MASOOD OSTAD (C)', 104026, 1, 9, 52, NULL, 'MASOOD OSTAD (C)', 0, 1, 1, '2024-09-10 11:18:34', '2024-09-10 11:18:34'),
(274, 3, 'AWAIS OLD PARTS (C)', 104027, 1, 9, 53, NULL, 'AWAIS OLD PARTS (C)', 0, 1, 1, '2024-09-10 12:50:02', '2024-09-10 12:50:02'),
(275, 3, 'REHMAT OSTAD (C)', 104028, 1, 9, 54, NULL, 'REHMAT OSTAD (C)', 0, 1, 1, '2024-09-10 13:04:07', '2024-09-10 13:04:07'),
(276, 3, 'HAJI SB EW-170 (C)', 104029, 1, 9, 55, NULL, 'HAJI SB EW-170 (C)', 0, 1, 1, '2024-09-10 13:04:29', '2024-09-10 13:04:29'),
(277, 3, 'BAKHT MEER ZADA (C)', 104030, 1, 9, 56, NULL, 'BAKHT MEER ZADA (C)', 0, 1, 1, '2024-09-10 13:20:32', '2024-09-10 13:20:32'),
(278, 3, 'HAROON BHAI (C)', 104031, 1, 9, 57, NULL, 'HAROON BHAI (C)', 0, 1, 1, '2024-09-11 05:12:53', '2024-09-11 05:12:53'),
(279, 3, 'KASHIF KHAN (C)', 104032, 1, 9, 58, NULL, 'KASHIF KHAN (C)', 0, 1, 1, '2024-09-11 07:24:15', '2024-09-11 07:24:15'),
(280, 3, 'TANWEER OSTAD (C)', 104033, 1, 9, 59, NULL, 'TANWEER OSTAD (C)', 0, 1, 1, '2024-09-11 09:29:46', '2024-09-11 09:29:46'),
(281, 3, 'SAEED TRADERS (S)', 301079, 3, 2, 60, NULL, 'SAEED TRADERS (S)', 0, 1, 1, '2024-09-11 11:39:05', '2024-09-11 11:39:05'),
(282, 3, 'BIKE EXPANCE', 809011, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-12 07:29:11', '2024-09-12 07:29:11'),
(283, 3, 'FUEL EXPANCE', 809012, 8, 48, NULL, NULL, NULL, 0, 1, 0, '2024-09-12 12:56:08', '2024-09-12 12:56:08'),
(284, 3, 'Software Purchase', 203001, 2, 50, NULL, NULL, NULL, 0, 1, 0, '2024-09-15 04:58:02', '2024-09-15 04:58:02'),
(285, 3, 'Software monthly subscription', 812001, 8, 52, NULL, NULL, NULL, 0, 1, 0, '2024-09-15 04:59:48', '2024-09-15 04:59:48'),
(286, 3, 'KASHIF OSTAD (C)', 104034, 1, 9, 61, NULL, 'KASHIF OSTAD (C)', 0, 1, 1, '2024-09-19 09:08:31', '2024-09-19 09:08:31'),
(287, 3, 'MOTOR BIKE', 204001, 2, 53, NULL, NULL, NULL, 0, 1, 0, '2024-09-19 09:19:30', '2024-09-19 09:19:30'),
(288, 3, 'ABID OSTAD (C)', 104035, 1, 9, 62, NULL, 'ABID OSTAD (C)', 0, 1, 1, '2024-09-19 11:10:57', '2024-09-19 11:10:57'),
(289, 3, 'RAHEEM INTERPRISES GJW (S)', 301080, 3, 2, 63, NULL, 'RAHEEM INTERPRISES GJW (S)', 0, 1, 1, '2024-09-22 04:34:11', '2024-09-22 04:34:11'),
(290, 3, 'HAKAB (C)', 104036, 1, 9, 64, NULL, 'HAKAB (C)', 0, 1, 1, '2024-09-22 04:51:17', '2024-09-22 04:51:17'),
(291, 3, 'IBRAHIM AUTO (C)', 104037, 1, 9, 65, NULL, 'IBRAHIM AUTO (C)', 0, 1, 1, '2024-09-22 05:12:36', '2024-09-22 05:12:36'),
(292, 3, 'ADNAN OSTAD (C)', 104038, 1, 9, 66, NULL, 'ADNAN OSTAD (C)', 0, 1, 1, '2024-09-24 11:59:09', '2024-09-24 11:59:09'),
(294, 3, 'HIDAYAT (S)', 301081, 3, 2, 68, NULL, 'HIDAYAT (S)', 0, 1, 1, '2024-09-24 12:16:38', '2024-09-24 12:16:38'),
(295, 3, 'IRFAN PATHAN (C)', 104039, 1, 9, 69, NULL, 'IRFAN PATHAN (C)', 0, 1, 1, '2024-09-30 13:01:36', '2024-09-30 13:01:36'),
(296, 3, 'Laptop', 205001, 2, 54, NULL, NULL, NULL, 0, 1, 0, '2024-10-02 11:58:40', '2024-10-02 11:58:40'),
(297, 3, 'Soneri Bank', 103014, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-13 05:10:56', '2024-10-13 05:10:56'),
(298, 3, 'PETRONAL GULF LUBRICANTS (S)', 301082, 3, 2, 70, NULL, 'PETRONAL GULF LUBRICANTS (S)', 0, 1, 1, '2024-10-14 05:11:13', '2024-10-14 05:11:13'),
(299, 3, 'EX-270 REHMAT OSTAD (C)', 104040, 1, 9, 71, NULL, 'EX-270 REHMAT OSTAD (C)', 0, 1, 1, '2024-10-15 11:17:58', '2024-10-15 11:17:58'),
(300, 3, 'HAFIZ IRFAN SAAB (C)', 104041, 1, 9, 72, NULL, 'HAFIZ IRFAN SAAB (C)', 0, 1, 1, '2024-10-15 12:12:36', '2024-10-15 12:12:36'),
(301, 11, 'Abbas', 301083, 3, 2, 73, NULL, 'Abbas', 0, 1, 1, '2024-10-17 05:53:17', '2024-10-17 05:53:17'),
(302, 11, 'ILYAS', 301084, 3, 2, 74, NULL, 'ILYAS', 0, 1, 1, '2024-10-17 10:01:27', '2024-10-17 10:01:27'),
(303, 11, 'SHIPPING ACCOUNT', 302006, 3, 8, NULL, NULL, NULL, 0, 1, 0, '2024-10-17 10:28:36', '2024-10-17 10:28:36'),
(304, 11, 'EASYPAISA', 108001, 1, 55, NULL, NULL, NULL, 0, 1, 0, '2024-10-17 10:31:04', '2024-10-17 10:31:04'),
(305, 11, 'JAZCASH', 103015, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-17 11:37:20', '2024-10-17 11:37:20'),
(306, 11, 'SHOP FURNITURE', 206001, 2, 56, NULL, NULL, NULL, 0, 1, 0, '2024-10-17 12:30:29', '2024-10-17 12:30:29'),
(307, 11, 'ALI', 301085, 3, 2, 75, NULL, 'ALI', 0, 1, 1, '2024-10-18 05:51:39', '2024-10-18 05:51:39'),
(308, 11, 'ammar', 104042, 1, 9, 76, NULL, 'ammar', 0, 1, 1, '2024-10-18 06:13:28', '2024-10-18 06:13:28'),
(309, 11, 'cash', 102008, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 06:18:05', '2024-10-18 06:18:05'),
(310, 11, 'bank account', 108002, 1, 55, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 06:19:04', '2024-10-18 06:19:04'),
(311, 11, 'khalid', 104043, 1, 9, 77, NULL, 'khalid', 0, 1, 1, '2024-10-18 06:25:33', '2024-10-18 06:25:33'),
(312, 19, 'EASYPAISA', 103016, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 09:30:42', '2024-10-18 09:30:42'),
(313, 19, 'JAZCASH', 103017, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 09:30:56', '2024-10-18 09:30:56'),
(314, 19, 'MEZAN BANK', 103018, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 09:31:17', '2024-10-18 09:31:17'),
(315, 19, 'BANK AL FALAH', 103019, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 09:31:47', '2024-10-18 09:31:47'),
(316, 19, 'ALI', 301086, 3, 2, 78, NULL, 'ALI', 0, 1, 1, '2024-10-18 09:33:45', '2024-10-18 09:33:45'),
(317, 19, 'KHALID', 301087, 3, 2, 79, NULL, 'KHALID', 0, 1, 1, '2024-10-18 09:34:25', '2024-10-18 09:34:25'),
(319, 19, 'CASH', 101002, 1, 1, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 09:49:48', '2024-10-18 09:49:48'),
(321, 19, 'AMMAR', 104044, 1, 9, 80, NULL, 'AMMAR', 0, 1, 1, '2024-10-18 09:58:02', '2024-10-18 09:58:02'),
(322, 19, 'BILL COST', 302007, 3, 8, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 10:06:58', '2024-10-18 10:06:58'),
(323, 19, 'KAMAL', 301088, 3, 2, 81, NULL, 'KAMAL', 0, 1, 1, '2024-10-18 11:01:03', '2024-10-18 11:01:03'),
(324, 19, 'Waqas', 104045, 1, 9, 82, NULL, 'Waqas', 0, 1, 1, '2024-10-18 11:45:55', '2024-10-18 11:45:55'),
(325, 19, 'Shop Furniture', 207001, 2, 58, NULL, NULL, NULL, 0, 1, 0, '2024-10-18 12:03:55', '2024-10-18 12:03:55'),
(326, 3, 'KOMATSO REHMAT WORK SHOP (C)', 104046, 1, 9, 83, NULL, 'KOMATSO REHMAT WORK SHOP (C)', 0, 1, 1, '2024-10-20 08:00:21', '2024-10-20 08:00:21'),
(328, 3, 'SADIQ AUTO (S)', 301089, 3, 2, 85, NULL, 'SADIQ AUTO (S)', 0, 1, 1, '2024-10-20 13:55:22', '2024-10-20 13:55:22'),
(329, 3, 'DX-140 REHMAT OSTAD (C)', 104047, 1, 9, 86, NULL, 'DX-140 REHMAT OSTAD (C)', 0, 1, 1, '2024-10-20 14:09:58', '2024-10-20 14:09:58'),
(330, 19, 'ABDULLAH', 104048, 1, 9, 87, NULL, 'ABDULLAH', 0, 1, 1, '2024-10-21 04:11:10', '2024-10-21 04:11:10'),
(331, 19, 'KONCEPT', 109001, 1, 57, NULL, NULL, 'CASH', 0, 1, 0, '2024-10-21 04:20:15', '2024-10-21 04:20:15'),
(332, 19, 'ALLIED BANK', 103020, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 04:22:05', '2024-10-21 04:22:05'),
(333, 19, 'HANZLA', 104049, 1, 9, 88, NULL, 'HANZLA', 0, 1, 1, '2024-10-21 05:23:46', '2024-10-21 05:23:46'),
(334, 19, 'Owner Equity 1', 501005, 5, 12, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 06:14:59', '2024-10-21 06:14:59'),
(335, 19, 'goodwill', 109002, 1, 57, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 06:34:58', '2024-10-21 06:34:58'),
(336, 19, 'Food Expense', 801006, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:08:05', '2024-10-21 07:08:05'),
(337, 19, 'Purchase expense', 801007, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:08:24', '2024-10-21 07:08:24'),
(338, 19, 'Staff Salaries', 801008, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:09:19', '2024-10-21 07:09:19'),
(339, 19, 'Travelling Expense', 801009, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:09:57', '2024-10-21 07:09:57'),
(340, 19, 'Utility Bills Expense', 801010, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:10:30', '2024-10-21 07:10:30'),
(341, 19, 'Office Supplies', 801011, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:11:07', '2024-10-21 07:11:07'),
(342, 19, 'Carriage  Charges', 801012, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:12:08', '2024-10-21 07:12:08'),
(343, 19, 'Shop Expense', 801013, 8, 7, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:12:26', '2024-10-21 07:12:26'),
(346, 19, 'Abdullah khan', 813001, 8, 59, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:19:05', '2024-10-21 07:19:05'),
(347, 19, 'Muhammad Ilyas', 813002, 8, 59, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:19:21', '2024-10-21 07:19:21'),
(348, 19, 'Khalid Nawaz', 813003, 8, 59, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:19:38', '2024-10-21 07:19:38'),
(349, 19, 'Vehicle Fuel', 814001, 8, 61, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:21:54', '2024-10-21 07:21:54'),
(350, 19, 'Bike Fuel', 814002, 8, 61, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:22:17', '2024-10-21 07:22:17'),
(351, 19, 'Electricity Bill', 815001, 8, 62, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:24:03', '2024-10-21 07:24:03'),
(352, 19, 'Mobile Bill', 815002, 8, 62, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:24:23', '2024-10-21 07:24:23'),
(353, 19, 'Shop Internet Bill', 815003, 8, 62, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 07:24:55', '2024-10-21 07:24:55'),
(354, 19, 'Abbas Owner Capital', 501006, 5, 12, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 11:08:55', '2024-10-21 11:08:55'),
(355, 19, 'Omer Owner Capital', 501007, 5, 12, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 11:09:36', '2024-10-21 11:09:36'),
(356, 19, 'Ilyas Owner Capital', 501008, 5, 12, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 11:09:49', '2024-10-21 11:09:49'),
(357, 19, 'CASH', 103021, 1, 6, NULL, NULL, NULL, 0, 1, 0, '2024-10-21 11:55:51', '2024-10-21 11:55:51'),
(358, 19, 'Cash', 304001, 4, 29, NULL, NULL, NULL, 0, 1, 0, '2024-10-22 04:22:29', '2024-10-22 04:22:29'),
(360, 19, 'Waqas', 603001, 6, 68, NULL, NULL, NULL, 0, 1, 0, '2024-10-22 04:24:41', '2024-10-22 04:24:41'),
(361, 19, 'Internet Bill', 303001, 3, 63, NULL, NULL, NULL, 0, 1, 0, '2024-10-22 04:30:56', '2024-10-22 04:30:56'),
(363, 19, 'Cash', 109004, 1, 57, NULL, NULL, NULL, 0, 1, 0, '2024-10-22 04:39:31', '2024-10-22 04:39:31'),
(365, 19, 'Cash', 102009, 1, 5, NULL, NULL, NULL, 0, 1, 0, '2024-10-22 04:42:55', '2024-10-22 04:42:55'),
(366, 19, 'Zain', 104050, 1, 9, 89, NULL, 'Zain', 0, 1, 1, '2024-10-25 06:32:17', '2024-10-25 06:32:17'),
(367, 19, 'Khuram', 301090, 3, 2, 90, NULL, 'Khuram', 0, 1, 1, '2024-10-25 10:31:38', '2024-10-25 10:31:38'),
(369, 14, 'dsf', 301091, 3, 2, 91, NULL, 'dsf', 0, 1, 1, '2024-12-17 09:19:36', '2024-12-17 09:19:36'),
(370, 14, 'payable expensse', 302008, 3, 8, NULL, NULL, 'dsdsfd', 0, 1, 0, '2024-12-17 09:33:05', '2024-12-17 09:33:05'),
(371, 14, 'cash name', 102010, 1, 5, NULL, NULL, 'dsdsasd', 0, 1, 0, '2024-12-17 11:35:24', '2024-12-17 11:35:24');

-- --------------------------------------------------------

--
-- Table structure for table `coa_groups`
--

CREATE TABLE `coa_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `parent` varchar(20) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `code` tinyint(4) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coa_groups`
--

INSERT INTO `coa_groups` (`id`, `user_id`, `name`, `parent`, `type`, `code`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Current Assets', 'Assets', 'BS', 1, NULL, NULL),
(2, NULL, 'Long Term Assets', 'Assets', 'BS', 2, NULL, NULL),
(3, NULL, 'Current Liabilities', 'Liabilities', 'BS', 3, NULL, NULL),
(4, NULL, 'Long Term Liabilities', 'Liabilities', 'BS', 4, NULL, NULL),
(5, NULL, 'Capital', 'Capital', 'BS', 5, NULL, NULL),
(6, NULL, 'Drawings', 'Capital', 'BS', 6, NULL, NULL),
(7, NULL, 'Revenues', 'Revenues', 'IS', 7, NULL, NULL),
(8, NULL, 'Expenses', 'Expenses', 'IS', 8, NULL, NULL),
(9, NULL, 'Cost', 'Cost', 'IS', 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coa_sub_groups`
--

CREATE TABLE `coa_sub_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `code` int(11) DEFAULT NULL,
  `coa_group_id` int(11) NOT NULL,
  `is_default` tinyint(4) NOT NULL DEFAULT 0,
  `type` varchar(20) DEFAULT NULL,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coa_sub_groups`
--

INSERT INTO `coa_sub_groups` (`id`, `user_id`, `name`, `code`, `coa_group_id`, `is_default`, `type`, `isActive`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Inventory', 101, 1, 1, NULL, 1, NULL, NULL),
(2, NULL, 'Purchase Orders Payables', 301, 3, 1, NULL, 1, NULL, NULL),
(3, NULL, 'Goods Purchased Cost', 901, 9, 1, NULL, 1, NULL, NULL),
(4, NULL, 'Goods Revenue', 701, 7, 1, NULL, 1, NULL, NULL),
(5, NULL, 'Cash', 102, 1, 1, 'cash', 1, NULL, '2024-10-21 07:52:25'),
(6, NULL, 'Bank', 103, 1, 1, 'cash', 1, NULL, NULL),
(7, NULL, 'Purchase Expenses', 801, 8, 1, NULL, 1, NULL, NULL),
(8, NULL, 'Purchase expenses Payables', 302, 3, 1, NULL, 1, NULL, NULL),
(9, NULL, 'Sales Customer Receivables', 104, 1, 0, NULL, 1, NULL, '2024-10-21 08:06:02'),
(12, NULL, 'Owner Equity', 501, 5, 0, NULL, 1, NULL, NULL),
(29, NULL, 'Other Payables', 304, 4, 0, NULL, 1, NULL, NULL),
(30, 3, 'Owner Equity', 502, 5, 0, NULL, 1, '2024-07-09 08:50:51', '2024-07-09 08:50:51'),
(31, 3, 'SHOP RENT', 802, 8, 0, NULL, 1, '2024-07-11 10:44:33', '2024-07-11 10:44:33'),
(32, 3, 'UTILITY BILLS', 803, 8, 0, NULL, 1, '2024-07-11 10:55:33', '2024-07-11 10:55:33'),
(33, 3, 'DAILY EXPANSES', 804, 8, 0, NULL, 1, '2024-07-11 10:56:40', '2024-07-11 10:56:40'),
(34, 3, 'SHOP SUPPLIES', 805, 8, 0, NULL, 1, '2024-07-11 10:57:47', '2024-07-11 10:57:47'),
(35, 3, 'SALE EXPENSES', 806, 8, 0, NULL, 1, '2024-07-11 11:21:07', '2024-07-11 11:21:07'),
(36, 3, 'STAF SALARIES', 807, 8, 0, NULL, 1, '2024-07-11 11:23:37', '2024-07-11 11:23:37'),
(37, 3, 'PARTNER DRAWINGS', 601, 6, 0, NULL, 1, '2024-07-11 11:25:39', '2024-07-11 11:25:39'),
(38, 3, 'Fixed Asset', 105, 1, 0, NULL, 1, '2024-07-11 11:28:42', '2024-07-11 11:28:42'),
(39, 3, 'REFUNDABLE ASSET', 106, 1, 0, NULL, 1, '2024-07-11 11:33:16', '2024-07-11 11:33:16'),
(40, 3, 'RECEIVEABLE LOAN', 107, 1, 0, NULL, 1, '2024-07-11 11:35:58', '2024-07-11 11:35:58'),
(42, 6, 'Electricity Bills', 808, 8, 0, NULL, 1, '2024-08-07 11:58:14', '2024-08-07 11:58:14'),
(44, 6, 'My Drawings ali', 602, 6, 0, NULL, 1, '2024-08-09 07:06:53', '2024-08-09 07:06:53'),
(45, 6, 'Shop Investment', 201, 2, 0, NULL, 1, '2024-08-09 07:23:08', '2024-08-09 07:23:08'),
(46, 3, '503-Owner Equity', 503, 5, 0, NULL, 1, '2024-09-01 11:12:30', '2024-09-01 11:12:30'),
(47, 3, 'Shop Opening Cost', 202, 2, 0, NULL, 1, '2024-09-01 11:59:39', '2024-09-01 11:59:39'),
(48, 3, 'SHOP EXPANCE', 809, 8, 0, NULL, 1, '2024-09-01 12:08:08', '2024-09-01 12:08:08'),
(49, 3, 'Employ Salery', 810, 8, 0, NULL, 1, '2024-09-01 12:16:13', '2024-09-01 12:16:13'),
(50, 3, 'Fixed Asset', 203, 2, 0, NULL, 1, '2024-09-15 04:55:46', '2024-09-15 04:55:46'),
(51, 3, 'Softwere', 811, 8, 0, NULL, 1, '2024-09-15 04:56:11', '2024-09-15 04:56:11'),
(52, 3, 'Software', 812, 8, 0, NULL, 1, '2024-09-15 04:58:42', '2024-09-15 04:58:42'),
(53, 3, 'MOTOR BIKE COST', 204, 2, 0, NULL, 1, '2024-09-19 09:19:04', '2024-09-19 09:19:04'),
(54, 3, 'Laptop Cost', 205, 2, 0, NULL, 1, '2024-10-02 11:58:13', '2024-10-02 11:58:13'),
(55, 11, 'BANK ACCOUNT', 108, 1, 0, NULL, 1, '2024-10-17 10:29:33', '2024-10-17 10:29:33'),
(56, 11, 'SHOP INVESTMENT', 206, 2, 0, NULL, 1, '2024-10-17 12:03:56', '2024-10-17 12:03:56'),
(57, 19, 'CASH', 109, 1, 0, NULL, 1, '2024-10-18 09:47:14', '2024-10-18 09:47:14'),
(58, 19, 'Shop Investment', 207, 2, 0, NULL, 1, '2024-10-18 12:02:32', '2024-10-18 12:02:32'),
(59, 19, 'Staff Salaries', 813, 8, 0, NULL, 1, '2024-10-21 07:14:58', '2024-10-21 07:14:58'),
(61, 19, 'Travelling Expense', 814, 8, 0, NULL, 1, '2024-10-21 07:21:03', '2024-10-21 07:21:03'),
(62, 19, 'Utility Bills Expense', 815, 8, 0, NULL, 1, '2024-10-21 07:23:30', '2024-10-21 07:23:30'),
(63, 19, 'Office Expense Payables', 303, 3, 0, NULL, 1, '2024-10-21 09:47:30', '2024-10-21 09:47:30'),
(64, 19, 'Abbas Owner Capital', 504, 5, 0, NULL, 1, '2024-10-21 11:02:59', '2024-10-21 11:02:59'),
(65, 19, 'Omer Owner Capital', 505, 5, 0, NULL, 1, '2024-10-21 11:03:35', '2024-10-21 11:03:35'),
(66, 19, 'Ilyas Owner Capital', 506, 5, 0, NULL, 1, '2024-10-21 11:03:57', '2024-10-21 11:03:57'),
(67, 19, 'Receivable loan', 110, 1, 0, NULL, 1, '2024-10-22 04:00:16', '2024-10-22 04:00:16'),
(68, 19, 'Cash', 603, 6, 0, NULL, 1, '2024-10-22 04:23:39', '2024-10-22 04:23:39'),
(69, 19, 'CASH', 305, 4, 0, NULL, 1, '2024-10-22 04:27:04', '2024-10-22 04:27:04');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(96, 3, 'BT KOREA', '2024-07-09 08:35:10', '2024-07-09 08:35:10'),
(97, 3, 'HANDOK', '2024-07-09 08:35:54', '2024-07-09 08:35:54'),
(98, 3, 'FLUTEK', '2024-07-09 08:36:06', '2024-07-09 08:36:06'),
(99, 3, 'BT KOREA CHN', '2024-07-09 08:36:19', '2024-07-09 08:36:19'),
(100, 3, 'DONGBU', '2024-07-09 08:36:40', '2024-07-09 08:36:40'),
(101, 3, 'NOK', '2024-07-09 08:36:49', '2024-07-09 08:36:49'),
(102, 3, 'YBS', '2024-07-09 08:36:57', '2024-07-09 08:36:57'),
(103, 3, 'LOCAL', '2024-07-09 10:41:15', '2024-07-09 10:41:15'),
(104, 3, 'WILSON', '2024-07-10 11:35:04', '2024-07-10 11:35:04'),
(105, 3, 'YCYY', '2024-07-12 02:15:32', '2024-07-12 02:15:32'),
(106, 3, 'UNITRUCK', '2024-07-12 02:16:18', '2024-07-12 02:16:18'),
(107, 3, 'koyo', '2024-07-12 03:41:41', '2024-07-12 03:41:41'),
(108, 3, 'KIK', '2024-07-12 03:51:13', '2024-07-12 03:51:13'),
(109, 3, 'CHAINA', '2024-07-12 03:56:42', '2024-07-12 03:56:42'),
(110, 3, 'CHAINA (HD)', '2024-07-12 04:36:53', '2024-07-12 04:36:53'),
(111, 3, 'FIRST', '2024-07-12 04:41:19', '2024-07-12 04:41:19'),
(112, 3, 'USA', '2024-07-12 08:02:59', '2024-07-12 08:02:59'),
(113, 3, 'KYG CHAINA', '2024-07-13 13:14:43', '2024-07-13 13:14:43'),
(114, 3, 'YBS', '2024-07-14 05:38:29', '2024-07-14 05:38:29'),
(115, 3, 'DOOSAN CHAINA', '2024-07-14 08:16:40', '2024-07-14 08:16:40'),
(116, 3, 'DOOSAN LOCAL', '2024-07-14 08:33:59', '2024-07-14 08:33:59'),
(117, 3, 'NOK CHAINA', '2024-07-14 09:57:14', '2024-07-14 09:57:14'),
(118, 3, 'BOILLET', '2024-07-16 10:48:24', '2024-07-16 10:48:24'),
(119, 3, 'YYG', '2024-07-16 10:51:51', '2024-07-16 10:51:51'),
(120, 3, 'K TOP KOREA', '2024-07-17 08:46:26', '2024-07-17 08:46:26'),
(121, 3, 'TIMKEN', '2024-07-18 11:56:29', '2024-07-18 11:56:29'),
(122, 3, 'DOOSAN KR', '2024-07-20 11:22:52', '2024-07-20 11:22:52'),
(123, 3, 'DELO SILVER', '2024-07-20 12:56:45', '2024-07-20 12:56:45'),
(124, 3, 'QABLI', '2024-07-22 11:06:54', '2024-07-22 11:06:54'),
(125, 3, 'USA', '2024-07-22 13:30:04', '2024-07-22 13:30:04'),
(126, 3, 'HLX', '2024-07-28 13:33:59', '2024-07-28 13:33:59'),
(127, 3, 'MACHINERY', '2024-07-28 13:35:12', '2024-07-28 13:35:12'),
(136, 3, 'NOK LOCAL', '2024-08-05 07:04:04', '2024-08-05 07:04:04'),
(137, 6, 'FleetGuard', '2024-08-05 08:32:10', '2024-08-05 08:32:10'),
(138, 6, 'FleetGuard', '2024-08-06 06:22:13', '2024-08-06 06:22:13'),
(139, 6, 'Local', '2024-08-06 06:27:17', '2024-08-06 06:27:17'),
(140, 6, 'China', '2024-08-06 07:10:23', '2024-08-06 07:10:23'),
(141, 3, 'HD CHAINA', '2024-08-07 06:16:32', '2024-08-07 06:16:32'),
(142, 3, 'DELO', '2024-08-11 07:02:38', '2024-08-11 07:02:38'),
(143, 6, 'denso', '2024-08-12 09:45:18', '2024-08-12 09:45:18'),
(144, 3, 'RKS', '2024-08-17 10:48:59', '2024-08-17 10:48:59'),
(145, 3, 'NOK KOREA', '2024-08-17 10:52:35', '2024-08-17 10:52:35'),
(146, 8, 'brandtest', '2024-08-22 10:44:01', '2024-08-22 10:44:01'),
(147, 10, 'honda', '2024-08-26 06:47:28', '2024-08-26 06:47:28'),
(148, 11, 'werv', '2024-08-28 08:21:28', '2024-08-28 08:21:28'),
(149, 13, 'bhy', '2024-08-30 10:55:01', '2024-08-30 10:55:01'),
(150, 3, 'YOUTHAI', '2024-09-09 13:37:14', '2024-09-09 13:37:14'),
(151, 3, 'SHAKURA', '2024-09-22 04:37:45', '2024-09-22 04:37:45'),
(152, 3, 'BKT', '2024-09-22 04:40:52', '2024-09-22 04:40:52'),
(153, 3, 'KOYO', '2024-09-24 05:19:20', '2024-09-24 05:19:20'),
(154, 3, 'TEC THANE', '2024-10-12 07:50:31', '2024-10-12 07:50:31'),
(155, 3, 'PG', '2024-10-14 05:06:48', '2024-10-14 05:06:48'),
(156, 11, 'Denso', '2024-10-17 05:48:42', '2024-10-17 05:48:42'),
(157, 11, 'DENSO', '2024-10-18 05:15:12', '2024-10-18 05:15:12'),
(158, 11, 'INDIA', '2024-10-18 05:29:06', '2024-10-18 05:29:06'),
(159, 11, 'LOCAL', '2024-10-18 05:29:19', '2024-10-18 05:29:19'),
(160, 11, 'LOCAL', '2024-10-18 05:35:49', '2024-10-18 05:35:49'),
(161, 11, 'JAPAN', '2024-10-18 05:46:23', '2024-10-18 05:46:23'),
(162, 19, 'JAPAN', '2024-10-18 08:08:46', '2024-10-18 08:08:46'),
(163, 19, 'CHINA', '2024-10-18 09:27:45', '2024-10-18 09:27:45'),
(164, 19, 'LOCAL', '2024-10-18 09:27:54', '2024-10-18 09:27:54'),
(165, 19, 'INDIA', '2024-10-18 09:28:08', '2024-10-18 09:28:08'),
(166, 19, 'DENSO', '2024-10-18 11:16:51', '2024-10-18 11:16:51'),
(167, 19, 'PAKISTAN', '2024-10-25 11:13:39', '2024-10-25 11:13:39'),
(168, 27, 'NPR', '2024-10-28 12:06:27', '2024-10-28 12:06:27'),
(169, 14, 'fdg', '2024-12-17 09:17:30', '2024-12-17 09:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `companies_oem_part_nos`
--

CREATE TABLE `companies_oem_part_nos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `oem_part_no_id` bigint(20) NOT NULL,
  `company_id` int(11) NOT NULL,
  `number1` varchar(255) DEFAULT NULL,
  `number2` varchar(255) DEFAULT NULL,
  `number3` varchar(255) DEFAULT NULL,
  `number4` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dimensions`
--

CREATE TABLE `dimensions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dimensions`
--

INSERT INTO `dimensions` (`id`, `user_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 3, 'DIAMETER', 'NA', '2024-07-09 08:42:52', '2024-07-09 08:42:52'),
(8, 6, 'H', 'H stand for height', '2024-08-06 06:25:43', '2024-08-06 06:25:43'),
(9, 6, 'w', 'W stands for Witdth', '2024-08-06 06:26:02', '2024-08-06 06:26:02'),
(10, 8, 'dimensiontest', 'dsajdhashdjahdjkas', '2024-08-22 10:45:59', '2024-08-22 10:45:59'),
(11, 11, 'H', 'Height', '2024-10-17 05:51:13', '2024-10-17 05:51:13'),
(12, 11, 'W', 'width', '2024-10-17 05:51:28', '2024-10-17 05:51:28'),
(13, 19, 'H', 'H STAND FOR HEIGHT', '2024-10-18 08:13:04', '2024-10-18 08:13:04'),
(14, 19, 'W', 'W STAND FOR WIDTH', '2024-10-18 08:13:27', '2024-10-18 08:13:27');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `po_id` bigint(20) NOT NULL,
  `amount` double NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT 'NA',
  `expense_type_id` int(11) NOT NULL,
  `coa_account_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `user_id`, `po_id`, `amount`, `description`, `expense_type_id`, `coa_account_id`, `created_at`, `updated_at`) VALUES
(2, 3, 33, 2500, 'CARRIGE CHARGES', 1, 234, '2024-09-03 09:48:02', '2024-09-03 09:48:02'),
(5, 3, 43, 450, 'CARRIGE CHARGES', 1, 234, '2024-09-04 06:01:50', '2024-09-04 06:01:50'),
(6, 11, 267, 1000, 'WINDSHIELD', 6, 303, '2024-10-17 10:38:25', '2024-10-17 10:38:25'),
(7, 11, 268, 1000, 'H FOR HEIGHT', 8, 303, '2024-10-18 06:05:09', '2024-10-18 06:05:09'),
(8, 19, 269, 1000, 'H STAND FOR HEIGHT', 9, 322, '2024-10-18 10:08:51', '2024-10-18 10:08:51'),
(9, 19, 270, 100, 'H STAND FOR HEIGHT', 9, 322, '2024-10-18 10:48:34', '2024-10-18 10:48:34'),
(10, 19, 283, 1000, 'H FOR HEIGHT', 10, 322, '2024-10-21 04:00:32', '2024-10-21 04:00:32'),
(11, 14, 1, 100, 'Dispose Inventory333', 12, 370, '2024-12-17 09:35:34', '2024-12-17 09:35:34'),
(12, 14, 2, 10, 'dd', 12, 370, '2024-12-17 09:37:45', '2024-12-17 09:37:45');

-- --------------------------------------------------------

--
-- Table structure for table `expense_types`
--

CREATE TABLE `expense_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense_types`
--

INSERT INTO `expense_types` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 3, 'Purchase Expenses', '2024-07-15 08:13:41', '2024-07-15 08:40:17'),
(2, 6, 'Carriage', '2024-07-29 11:07:30', '2024-07-29 11:07:30'),
(3, 6, 'Bills', '2024-08-05 05:40:35', '2024-08-05 05:40:35'),
(4, 8, 'expansetest', '2024-08-22 11:08:16', '2024-08-22 11:08:16'),
(5, 3, 'Carrige Expance', '2024-09-03 09:20:10', '2024-09-03 09:20:10'),
(6, 11, 'Shipping Cost', '2024-10-17 05:59:41', '2024-10-17 05:59:41'),
(7, 11, 'BILLS', '2024-10-18 06:02:10', '2024-10-18 06:02:10'),
(8, 11, 'CARRAGE', '2024-10-18 06:02:25', '2024-10-18 06:02:25'),
(9, 19, 'SHIPPING COAST', '2024-10-18 09:41:44', '2024-10-18 09:41:44'),
(10, 19, 'CARRAGE', '2024-10-18 09:56:12', '2024-10-18 09:56:12'),
(11, 19, 'BILL COST', '2024-10-21 05:26:05', '2024-10-21 05:26:05'),
(12, 14, 'exeeee', '2024-12-17 09:22:20', '2024-12-17 09:22:20');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_types`
--

CREATE TABLE `inventory_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `customer_id` bigint(20) DEFAULT NULL,
  `delivered_to` varchar(255) NOT NULL DEFAULT 'NA',
  `invoice_no` varchar(255) DEFAULT NULL,
  `walk_in_customer_name` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `remarks` varchar(155) DEFAULT NULL,
  `total_amount` double NOT NULL,
  `discount` double NOT NULL DEFAULT 0,
  `total_after_discount` double NOT NULL,
  `received_amount` double DEFAULT NULL,
  `bank_received_amount` double DEFAULT NULL,
  `is_pending_neg_inventory` int(11) NOT NULL DEFAULT 0,
  `tax_type` int(11) DEFAULT NULL,
  `sale_type` int(11) DEFAULT NULL,
  `gst` double NOT NULL DEFAULT 0,
  `total_after_gst` double DEFAULT NULL,
  `is_pending` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `gst_percentage` double DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `bank_account_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `user_id`, `store_id`, `customer_id`, `delivered_to`, `invoice_no`, `walk_in_customer_name`, `date`, `remarks`, `total_amount`, `discount`, `total_after_discount`, `received_amount`, `bank_received_amount`, `is_pending_neg_inventory`, `tax_type`, `sale_type`, `gst`, `total_after_gst`, `is_pending`, `created_at`, `updated_at`, `gst_percentage`, `account_id`, `bank_account_id`) VALUES
(1, 14, 12, NULL, 'fdsfds', 'INO-1', 'yyutyu', '2024-12-17', 'fdsfds', 200, 0, 200, 200, NULL, 0, 1, 1, 0, 200, 0, '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL, NULL, NULL),
(2, 14, 12, NULL, 's', 'INO-2', 's', '2024-12-17', NULL, 2755, 0, 2755, 2755, NULL, 0, 1, 1, 0, 2755, 0, '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_children`
--

CREATE TABLE `invoice_children` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `invoice_id` int(11) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity` double NOT NULL DEFAULT 0,
  `is_negative` int(11) NOT NULL DEFAULT 0,
  `price` double NOT NULL DEFAULT 0,
  `cost` double NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_children`
--

INSERT INTO `invoice_children` (`id`, `user_id`, `invoice_id`, `item_id`, `quantity`, `is_negative`, `price`, `cost`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 534, 20, 0, 10, 1799.875, '2024-12-17 11:37:00', '2024-12-17 11:37:00'),
(2, 14, 2, 534, 5, 0, 551, 1799.875, '2024-12-17 12:05:51', '2024-12-17 12:05:51');

-- --------------------------------------------------------

--
-- Table structure for table `item_inventory`
--

CREATE TABLE `item_inventory` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `purchase_order_id` bigint(20) DEFAULT NULL,
  `adjust_inventory_id` int(11) DEFAULT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `inventory_type_id` int(11) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `purchase_price` double DEFAULT NULL,
  `store_id` int(11) NOT NULL,
  `quantity_in` varchar(255) DEFAULT NULL,
  `quantity_out` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `return_child_invoice_id` int(11) DEFAULT NULL,
  `return_child_po_id` int(11) DEFAULT NULL,
  `rack_id` int(11) DEFAULT NULL,
  `shelf_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `item_inventory`
--

INSERT INTO `item_inventory` (`id`, `user_id`, `purchase_order_id`, `adjust_inventory_id`, `invoice_id`, `inventory_type_id`, `item_id`, `purchase_price`, `store_id`, `quantity_in`, `quantity_out`, `date`, `created_at`, `updated_at`, `return_child_invoice_id`, `return_child_po_id`, `rack_id`, `shelf_id`) VALUES
(1, 14, 1, NULL, NULL, 1, 534, 2750, 12, '10', '', '2024-12-17', '2024-12-17 09:35:34', '2024-12-17 09:35:34', NULL, NULL, NULL, NULL),
(2, 14, 2, NULL, NULL, 1, 534, 2750, 12, '5', '', '2024-12-17', '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL, NULL, NULL, NULL),
(3, 14, 2, NULL, NULL, 1, 534, 2750, 12, '10', '', '2024-12-17', '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL, NULL, NULL, NULL),
(4, 14, NULL, 1, NULL, 8, 534, 102, 12, '10', '', '2024-12-17', '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL, NULL, NULL, NULL),
(5, 14, NULL, 2, NULL, 8, 534, 103, 12, '25', '', '2024-12-17', '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL, NULL, NULL, NULL),
(6, 14, NULL, 3, NULL, 9, 534, 25, 12, NULL, '10', '2024-12-17', '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL, NULL, NULL, NULL),
(7, 14, NULL, 4, NULL, 9, 534, 21, 12, NULL, '10', '2024-12-17', '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL, NULL, NULL, NULL),
(8, 14, NULL, NULL, 1, 8, 534, 10, 12, NULL, '20', '2024-12-17', '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL, NULL, NULL, NULL),
(9, 14, NULL, NULL, NULL, 4, 534, NULL, 12, '4', '', '2024-12-17', '2024-12-17 12:04:18', '2024-12-17 12:04:18', 1, NULL, NULL, NULL),
(10, 14, NULL, NULL, 2, 8, 534, 551, 12, NULL, '5', '2024-12-17', '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL, NULL, NULL, NULL),
(11, 14, NULL, 5, NULL, 8, 534, 25, 12, '25', '', '2024-12-17', '2024-12-17 12:07:07', '2024-12-17 12:07:07', NULL, NULL, NULL, NULL),
(12, 14, NULL, NULL, NULL, 4, 534, NULL, 12, '3', '', '2024-12-17', '2024-12-17 12:48:54', '2024-12-17 12:48:54', 2, NULL, NULL, NULL),
(13, 14, NULL, NULL, NULL, 4, 534, NULL, 12, '15', '', '2024-12-17', '2024-12-17 12:49:51', '2024-12-17 12:49:51', 3, NULL, NULL, NULL),
(14, 14, NULL, 6, NULL, 8, 534, 5, 12, '5', '', '2024-12-17', '2024-12-17 12:50:31', '2024-12-17 12:50:31', NULL, NULL, NULL, NULL),
(15, 14, NULL, NULL, NULL, 4, 534, NULL, 12, '2', '', '2024-12-17', '2024-12-17 12:51:16', '2024-12-17 12:51:16', 4, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_oem_part_model`
--

CREATE TABLE `item_oem_part_model` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `machine_part_oem_part_nos_machine_models_id` int(11) NOT NULL,
  `items_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_oem_part_model_item`
--

CREATE TABLE `item_oem_part_model_item` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `machine_part_oem_part_nos_machine_models_id` int(10) UNSIGNED NOT NULL,
  `items_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_rack_shelves`
--

CREATE TABLE `item_rack_shelves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_id` int(10) UNSIGNED DEFAULT NULL,
  `item_id` int(10) UNSIGNED DEFAULT NULL,
  `rack_id` int(10) UNSIGNED DEFAULT NULL,
  `shelf_id` int(10) UNSIGNED DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `purchase_order_id` int(10) UNSIGNED DEFAULT NULL,
  `purchase_order_child_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kit_child`
--

CREATE TABLE `kit_child` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `parent_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `machines`
--

CREATE TABLE `machines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machines`
--

INSERT INTO `machines` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 3, 'Excavator', '2024-07-09 08:12:39', '2024-07-09 08:12:39'),
(2, 3, 'UNIVERSAL', '2024-07-09 10:37:03', '2024-07-09 10:37:03'),
(9, 6, 'Excavator', '2024-08-05 08:30:01', '2024-08-05 08:30:01'),
(10, 8, 'machinetest', '2024-08-22 10:43:14', '2024-08-22 10:43:14'),
(11, 10, 'civic', '2024-08-26 06:45:17', '2024-08-26 06:45:17'),
(12, 11, 'eeewr', '2024-08-28 08:20:56', '2024-08-28 08:20:56'),
(13, 13, 'khan', '2024-08-30 10:54:04', '2024-08-30 10:54:04'),
(14, 11, 'Suv', '2024-10-17 05:47:27', '2024-10-17 05:47:27'),
(15, 11, 'SUV', '2024-10-17 08:45:13', '2024-10-17 08:45:13'),
(16, 11, 'CAR', '2024-10-18 05:13:06', '2024-10-18 05:13:06'),
(17, 11, 'BIKE', '2024-10-18 05:32:47', '2024-10-18 05:32:47'),
(18, 19, 'BIKE SEAT', '2024-10-18 08:03:25', '2024-10-18 08:03:25'),
(19, 19, 'BIKE', '2024-10-18 08:05:36', '2024-10-18 08:05:36'),
(20, 19, 'SUV', '2024-10-18 11:15:03', '2024-10-18 11:15:03'),
(21, 19, 'CAR', '2024-10-21 03:48:54', '2024-10-21 03:48:54'),
(22, 19, 'Car', '2024-10-22 07:25:33', '2024-10-22 07:25:33'),
(23, 19, 'Bike', '2024-10-25 10:11:16', '2024-10-25 10:11:16'),
(24, 27, 'car', '2024-10-28 12:02:18', '2024-10-28 12:02:18'),
(25, 14, 'fgd', '2024-12-17 09:17:04', '2024-12-17 09:17:04');

-- --------------------------------------------------------

--
-- Table structure for table `machine_item_parts`
--

CREATE TABLE `machine_item_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `machine_part_oem_part_nos_machine_models_id` int(10) UNSIGNED DEFAULT NULL,
  `machine_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_item_parts`
--

INSERT INTO `machine_item_parts` (`id`, `user_id`, `machine_part_oem_part_nos_machine_models_id`, `machine_id`, `created_at`, `updated_at`) VALUES
(4, NULL, 4, 1, NULL, NULL),
(5, NULL, 5, 1, NULL, NULL),
(6, NULL, 6, 1, NULL, NULL),
(7, NULL, 7, 1, NULL, NULL),
(8, NULL, 8, 1, NULL, NULL),
(9, NULL, 9, 2, NULL, NULL),
(10, NULL, 10, 1, NULL, NULL),
(11, NULL, 11, 1, NULL, NULL),
(12, NULL, 12, 1, NULL, NULL),
(13, NULL, 13, 1, NULL, NULL),
(14, NULL, 14, 1, NULL, NULL),
(15, NULL, 15, 1, NULL, NULL),
(16, NULL, 16, 1, NULL, NULL),
(17, NULL, 17, 1, NULL, NULL),
(18, NULL, 18, 1, NULL, NULL),
(19, NULL, 19, 1, NULL, NULL),
(20, NULL, 20, 1, NULL, NULL),
(21, NULL, 21, 1, NULL, NULL),
(22, NULL, 22, 1, NULL, NULL),
(23, NULL, 23, 1, NULL, NULL),
(24, NULL, 24, 1, NULL, NULL),
(25, NULL, 25, 1, NULL, NULL),
(26, NULL, 26, 1, NULL, NULL),
(27, NULL, 27, 1, NULL, NULL),
(28, NULL, 28, 2, NULL, NULL),
(29, NULL, 29, 2, NULL, NULL),
(30, NULL, 30, 2, NULL, NULL),
(31, NULL, 31, 2, NULL, NULL),
(32, NULL, 32, 2, NULL, NULL),
(33, NULL, 33, 2, NULL, NULL),
(34, NULL, 34, 2, NULL, NULL),
(35, NULL, 35, 2, NULL, NULL),
(36, NULL, 36, 2, NULL, NULL),
(37, NULL, 37, 2, NULL, NULL),
(38, NULL, 38, 1, NULL, NULL),
(39, NULL, 39, 1, NULL, NULL),
(40, NULL, 40, 1, NULL, NULL),
(41, NULL, 41, 1, NULL, NULL),
(42, NULL, 42, 1, NULL, NULL),
(43, NULL, 43, 1, NULL, NULL),
(44, NULL, 44, 1, NULL, NULL),
(45, NULL, 45, 1, NULL, NULL),
(46, NULL, 46, 1, NULL, NULL),
(47, NULL, 47, 1, NULL, NULL),
(48, NULL, 48, 1, NULL, NULL),
(49, NULL, 49, 1, NULL, NULL),
(50, NULL, 50, 1, NULL, NULL),
(51, NULL, 51, 1, NULL, NULL),
(52, NULL, 52, 1, NULL, NULL),
(53, NULL, 53, 1, NULL, NULL),
(54, NULL, 54, 1, NULL, NULL),
(55, NULL, 55, 1, NULL, NULL),
(56, NULL, 56, 1, NULL, NULL),
(57, NULL, 57, 1, NULL, NULL),
(58, NULL, 58, 1, NULL, NULL),
(59, NULL, 59, 1, NULL, NULL),
(60, NULL, 60, 1, NULL, NULL),
(61, NULL, 61, 1, NULL, NULL),
(62, NULL, 62, 1, NULL, NULL),
(63, NULL, 63, 1, NULL, NULL),
(64, NULL, 64, 1, NULL, NULL),
(65, NULL, 65, 1, NULL, NULL),
(66, NULL, 66, 1, NULL, NULL),
(67, NULL, 67, 1, NULL, NULL),
(68, NULL, 68, 1, NULL, NULL),
(69, NULL, 69, 1, NULL, NULL),
(70, NULL, 70, 1, NULL, NULL),
(71, NULL, 71, 1, NULL, NULL),
(72, NULL, 72, 1, NULL, NULL),
(73, NULL, 73, 1, NULL, NULL),
(74, NULL, 74, 1, NULL, NULL),
(75, NULL, 75, 1, NULL, NULL),
(76, NULL, 76, 1, NULL, NULL),
(77, NULL, 77, 1, NULL, NULL),
(78, NULL, 78, 1, NULL, NULL),
(79, NULL, 79, 1, NULL, NULL),
(80, NULL, 80, 1, NULL, NULL),
(81, NULL, 81, 1, NULL, NULL),
(82, NULL, 82, 1, NULL, NULL),
(83, NULL, 83, 1, NULL, NULL),
(84, NULL, 84, 1, NULL, NULL),
(85, NULL, 85, 1, NULL, NULL),
(86, NULL, 86, 1, NULL, NULL),
(87, NULL, 87, 1, NULL, NULL),
(88, NULL, 88, 1, NULL, NULL),
(89, NULL, 89, 2, NULL, NULL),
(90, NULL, 90, 1, NULL, NULL),
(91, NULL, 91, 1, NULL, NULL),
(92, NULL, 92, 1, NULL, NULL),
(93, NULL, 93, 1, NULL, NULL),
(94, NULL, 94, 1, NULL, NULL),
(95, NULL, 95, 1, NULL, NULL),
(96, NULL, 96, 1, NULL, NULL),
(97, NULL, 97, 1, NULL, NULL),
(98, NULL, 98, 1, NULL, NULL),
(99, NULL, 99, 1, NULL, NULL),
(100, NULL, 100, 1, NULL, NULL),
(101, NULL, 101, 1, NULL, NULL),
(102, NULL, 102, 1, NULL, NULL),
(103, NULL, 103, 1, NULL, NULL),
(104, NULL, 104, 1, NULL, NULL),
(105, NULL, 105, 1, NULL, NULL),
(106, NULL, 106, 1, NULL, NULL),
(107, NULL, 107, 1, NULL, NULL),
(108, NULL, 108, 1, NULL, NULL),
(109, NULL, 109, 1, NULL, NULL),
(110, NULL, 110, 1, NULL, NULL),
(111, NULL, 111, 1, NULL, NULL),
(112, NULL, 112, 1, NULL, NULL),
(113, NULL, 113, 1, NULL, NULL),
(114, NULL, 114, 1, NULL, NULL),
(115, NULL, 115, 1, NULL, NULL),
(116, NULL, 116, 1, NULL, NULL),
(117, NULL, 117, 1, NULL, NULL),
(118, NULL, 118, 1, NULL, NULL),
(119, NULL, 119, 1, NULL, NULL),
(120, NULL, 120, 1, NULL, NULL),
(121, NULL, 121, 1, NULL, NULL),
(122, NULL, 122, 1, NULL, NULL),
(123, NULL, 123, 1, NULL, NULL),
(124, NULL, 124, 1, NULL, NULL),
(125, NULL, 125, 1, NULL, NULL),
(126, NULL, 126, 1, NULL, NULL),
(127, NULL, 127, 1, NULL, NULL),
(128, NULL, 128, 1, NULL, NULL),
(129, NULL, 129, 1, NULL, NULL),
(130, NULL, 130, 2, NULL, NULL),
(131, NULL, 131, 1, NULL, NULL),
(132, NULL, 132, 1, NULL, NULL),
(133, NULL, 133, 1, NULL, NULL),
(134, NULL, 134, 1, NULL, NULL),
(135, NULL, 135, 1, NULL, NULL),
(136, NULL, 136, 1, NULL, NULL),
(137, NULL, 137, 1, NULL, NULL),
(138, NULL, 138, 1, NULL, NULL),
(139, NULL, 139, 1, NULL, NULL),
(140, NULL, 140, 1, NULL, NULL),
(141, NULL, 141, 1, NULL, NULL),
(142, NULL, 142, 1, NULL, NULL),
(143, NULL, 143, 1, NULL, NULL),
(144, NULL, 144, 1, NULL, NULL),
(145, NULL, 145, 1, NULL, NULL),
(146, NULL, 146, 1, NULL, NULL),
(147, NULL, 147, 1, NULL, NULL),
(148, NULL, 148, 1, NULL, NULL),
(149, NULL, 149, 1, NULL, NULL),
(150, NULL, 150, 1, NULL, NULL),
(151, NULL, 151, 1, NULL, NULL),
(152, NULL, 152, 1, NULL, NULL),
(153, NULL, 153, 1, NULL, NULL),
(154, NULL, 154, 1, NULL, NULL),
(155, NULL, 155, 1, NULL, NULL),
(156, NULL, 156, 1, NULL, NULL),
(157, NULL, 157, 1, NULL, NULL),
(158, NULL, 158, 1, NULL, NULL),
(159, NULL, 159, 1, NULL, NULL),
(160, NULL, 160, 1, NULL, NULL),
(161, NULL, 161, 1, NULL, NULL),
(162, NULL, 162, 1, NULL, NULL),
(163, NULL, 163, 1, NULL, NULL),
(164, NULL, 164, 1, NULL, NULL),
(165, NULL, 165, 1, NULL, NULL),
(166, NULL, 166, 1, NULL, NULL),
(167, NULL, 167, 1, NULL, NULL),
(168, NULL, 168, 1, NULL, NULL),
(169, NULL, 169, 1, NULL, NULL),
(170, NULL, 170, 1, NULL, NULL),
(171, NULL, 171, 1, NULL, NULL),
(172, NULL, 172, 1, NULL, NULL),
(173, NULL, 173, 1, NULL, NULL),
(174, NULL, 174, 1, NULL, NULL),
(175, NULL, 175, 1, NULL, NULL),
(176, NULL, 176, 1, NULL, NULL),
(177, NULL, 177, 1, NULL, NULL),
(178, NULL, 178, 1, NULL, NULL),
(179, NULL, 179, 1, NULL, NULL),
(180, NULL, 180, 1, NULL, NULL),
(181, NULL, 181, 1, NULL, NULL),
(182, NULL, 182, 1, NULL, NULL),
(183, NULL, 183, 1, NULL, NULL),
(184, NULL, 184, 1, NULL, NULL),
(185, NULL, 185, 1, NULL, NULL),
(186, NULL, 186, 1, NULL, NULL),
(187, NULL, 187, 1, NULL, NULL),
(188, NULL, 188, 1, NULL, NULL),
(189, NULL, 189, 1, NULL, NULL),
(190, NULL, 190, 1, NULL, NULL),
(191, NULL, 191, 1, NULL, NULL),
(192, NULL, 192, 1, NULL, NULL),
(193, NULL, 193, 1, NULL, NULL),
(194, NULL, 194, 1, NULL, NULL),
(195, NULL, 195, 1, NULL, NULL),
(196, NULL, 196, 1, NULL, NULL),
(197, NULL, 197, 1, NULL, NULL),
(198, NULL, 198, 1, NULL, NULL),
(199, NULL, 199, 1, NULL, NULL),
(200, NULL, 200, 1, NULL, NULL),
(201, NULL, 201, 1, NULL, NULL),
(202, NULL, 202, 1, NULL, NULL),
(203, NULL, 203, 1, NULL, NULL),
(204, NULL, 204, 1, NULL, NULL),
(205, NULL, 205, 1, NULL, NULL),
(206, NULL, 206, 1, NULL, NULL),
(207, NULL, 207, 1, NULL, NULL),
(208, NULL, 208, 1, NULL, NULL),
(209, NULL, 209, 1, NULL, NULL),
(210, NULL, 210, 1, NULL, NULL),
(211, NULL, 211, 1, NULL, NULL),
(212, NULL, 212, 1, NULL, NULL),
(213, NULL, 213, 1, NULL, NULL),
(214, NULL, 214, 1, NULL, NULL),
(215, NULL, 215, 1, NULL, NULL),
(216, NULL, 216, 1, NULL, NULL),
(217, NULL, 217, 1, NULL, NULL),
(218, NULL, 218, 1, NULL, NULL),
(219, NULL, 219, 1, NULL, NULL),
(220, NULL, 220, 2, NULL, NULL),
(221, NULL, 221, 1, NULL, NULL),
(222, NULL, 222, 1, NULL, NULL),
(223, NULL, 223, 1, NULL, NULL),
(224, NULL, 224, 1, NULL, NULL),
(225, NULL, 225, 1, NULL, NULL),
(226, NULL, 226, 1, NULL, NULL),
(227, NULL, 227, 1, NULL, NULL),
(228, NULL, 228, 1, NULL, NULL),
(229, NULL, 229, 1, NULL, NULL),
(230, NULL, 230, 1, NULL, NULL),
(231, NULL, 231, 1, NULL, NULL),
(232, NULL, 232, 1, NULL, NULL),
(233, NULL, 233, 1, NULL, NULL),
(234, NULL, 234, 1, NULL, NULL),
(235, NULL, 235, 1, NULL, NULL),
(236, NULL, 236, 1, NULL, NULL),
(237, NULL, 237, 1, NULL, NULL),
(238, NULL, 238, 1, NULL, NULL),
(239, NULL, 239, 1, NULL, NULL),
(240, NULL, 240, 1, NULL, NULL),
(241, NULL, 241, 1, NULL, NULL),
(242, NULL, 242, 1, NULL, NULL),
(243, NULL, 243, 1, NULL, NULL),
(244, NULL, 244, 1, NULL, NULL),
(245, NULL, 245, 1, NULL, NULL),
(246, NULL, 246, 1, NULL, NULL),
(247, NULL, 247, 1, NULL, NULL),
(248, NULL, 248, 1, NULL, NULL),
(249, NULL, 249, 1, NULL, NULL),
(250, NULL, 250, 1, NULL, NULL),
(251, NULL, 251, 1, NULL, NULL),
(252, NULL, 252, 1, NULL, NULL),
(253, NULL, 253, 1, NULL, NULL),
(254, NULL, 254, 1, NULL, NULL),
(255, NULL, 255, 1, NULL, NULL),
(256, NULL, 256, 1, NULL, NULL),
(257, NULL, 257, 1, NULL, NULL),
(258, NULL, 258, 1, NULL, NULL),
(259, NULL, 259, 1, NULL, NULL),
(260, NULL, 260, 1, NULL, NULL),
(261, NULL, 261, 1, NULL, NULL),
(262, NULL, 262, 1, NULL, NULL),
(263, NULL, 263, 1, NULL, NULL),
(264, NULL, 264, 1, NULL, NULL),
(265, NULL, 265, 1, NULL, NULL),
(266, NULL, 266, 1, NULL, NULL),
(267, NULL, 267, 1, NULL, NULL),
(268, NULL, 268, 1, NULL, NULL),
(269, NULL, 269, 1, NULL, NULL),
(270, NULL, 270, 1, NULL, NULL),
(271, NULL, 271, 1, NULL, NULL),
(272, NULL, 272, 1, NULL, NULL),
(273, NULL, 273, 1, NULL, NULL),
(274, NULL, 274, 1, NULL, NULL),
(275, NULL, 275, 1, NULL, NULL),
(276, NULL, 276, 1, NULL, NULL),
(277, NULL, 277, 1, NULL, NULL),
(278, NULL, 278, 1, NULL, NULL),
(279, NULL, 279, 1, NULL, NULL),
(280, NULL, 280, 1, NULL, NULL),
(281, NULL, 281, 1, NULL, NULL),
(282, NULL, 282, 1, NULL, NULL),
(283, NULL, 283, 1, NULL, NULL),
(284, NULL, 284, 1, NULL, NULL),
(285, NULL, 285, 1, NULL, NULL),
(286, NULL, 286, 1, NULL, NULL),
(287, NULL, 287, 1, NULL, NULL),
(288, NULL, 288, 1, NULL, NULL),
(289, NULL, 289, 1, NULL, NULL),
(290, NULL, 290, 1, NULL, NULL),
(291, NULL, 291, 1, NULL, NULL),
(292, NULL, 292, 1, NULL, NULL),
(293, NULL, 293, 2, NULL, NULL),
(294, NULL, 294, 2, NULL, NULL),
(295, NULL, 295, 1, NULL, NULL),
(296, NULL, 296, 1, NULL, NULL),
(297, NULL, 297, 1, NULL, NULL),
(298, NULL, 298, 1, NULL, NULL),
(299, NULL, 299, 2, NULL, NULL),
(300, NULL, 300, 2, NULL, NULL),
(301, NULL, 301, 2, NULL, NULL),
(302, NULL, 302, 1, NULL, NULL),
(303, NULL, 303, 1, NULL, NULL),
(304, NULL, 304, 1, NULL, NULL),
(305, NULL, 305, 1, NULL, NULL),
(306, NULL, 306, 1, NULL, NULL),
(307, NULL, 307, 1, NULL, NULL),
(308, NULL, 308, 1, NULL, NULL),
(309, NULL, 309, 1, NULL, NULL),
(310, NULL, 310, 2, NULL, NULL),
(311, NULL, 311, 1, NULL, NULL),
(312, NULL, 312, 1, NULL, NULL),
(313, NULL, 313, 1, NULL, NULL),
(314, NULL, 314, 1, NULL, NULL),
(315, NULL, 315, 1, NULL, NULL),
(316, NULL, 316, 1, NULL, NULL),
(317, NULL, 317, 3, NULL, NULL),
(318, NULL, 318, 6, NULL, NULL),
(319, NULL, 319, 7, NULL, NULL),
(320, NULL, 320, 8, NULL, NULL),
(321, NULL, 321, 1, NULL, NULL),
(322, NULL, 322, 1, NULL, NULL),
(323, NULL, 323, 1, NULL, NULL),
(324, NULL, 324, 1, NULL, NULL),
(325, NULL, 325, 1, NULL, NULL),
(326, NULL, 326, 1, NULL, NULL),
(327, NULL, 327, 1, NULL, NULL),
(328, NULL, 328, 1, NULL, NULL),
(329, NULL, 329, 1, NULL, NULL),
(330, NULL, 330, 1, NULL, NULL),
(331, NULL, 331, 1, NULL, NULL),
(332, NULL, 332, 1, NULL, NULL),
(333, NULL, 333, 9, NULL, NULL),
(334, NULL, 334, 9, NULL, NULL),
(335, NULL, 335, 2, NULL, NULL),
(336, NULL, 336, 1, NULL, NULL),
(337, NULL, 337, 1, NULL, NULL),
(338, NULL, 338, 1, NULL, NULL),
(339, NULL, 339, 1, NULL, NULL),
(340, NULL, 340, 1, NULL, NULL),
(341, NULL, 341, 1, NULL, NULL),
(342, NULL, 342, 1, NULL, NULL),
(343, NULL, 343, 1, NULL, NULL),
(344, NULL, 344, 1, NULL, NULL),
(345, NULL, 345, 2, NULL, NULL),
(346, NULL, 346, 1, NULL, NULL),
(347, NULL, 347, 2, NULL, NULL),
(348, NULL, 348, 1, NULL, NULL),
(349, NULL, 349, 1, NULL, NULL),
(350, NULL, 350, 1, NULL, NULL),
(351, NULL, 351, 2, NULL, NULL),
(352, NULL, 352, 1, NULL, NULL),
(353, NULL, 353, 1, NULL, NULL),
(354, NULL, 354, 1, NULL, NULL),
(355, NULL, 355, 1, NULL, NULL),
(356, NULL, 356, 1, NULL, NULL),
(357, NULL, 357, 1, NULL, NULL),
(358, NULL, 358, 1, NULL, NULL),
(359, NULL, 359, 1, NULL, NULL),
(360, NULL, 360, 2, NULL, NULL),
(361, NULL, 361, 2, NULL, NULL),
(362, NULL, 362, 1, NULL, NULL),
(363, NULL, 363, 2, NULL, NULL),
(364, NULL, 364, 9, NULL, NULL),
(365, NULL, 365, 1, NULL, NULL),
(366, NULL, 366, 1, NULL, NULL),
(378, NULL, 1, 12, NULL, NULL),
(379, NULL, 2, 12, NULL, NULL),
(380, NULL, 3, 13, NULL, NULL),
(381, NULL, 367, 1, NULL, NULL),
(382, NULL, 368, 1, NULL, NULL),
(383, NULL, 369, 1, NULL, NULL),
(384, NULL, 370, 1, NULL, NULL),
(385, NULL, 371, 1, NULL, NULL),
(386, NULL, 372, 1, NULL, NULL),
(387, NULL, 373, 1, NULL, NULL),
(388, NULL, 374, 1, NULL, NULL),
(389, NULL, 375, 1, NULL, NULL),
(390, NULL, 376, 1, NULL, NULL),
(391, NULL, 377, 1, NULL, NULL),
(392, NULL, 378, 1, NULL, NULL),
(393, NULL, 379, 1, NULL, NULL),
(394, NULL, 380, 1, NULL, NULL),
(395, NULL, 381, 1, NULL, NULL),
(396, NULL, 382, 1, NULL, NULL),
(397, NULL, 383, 1, NULL, NULL),
(398, NULL, 384, 1, NULL, NULL),
(399, NULL, 385, 1, NULL, NULL),
(400, NULL, 386, 1, NULL, NULL),
(401, NULL, 387, 1, NULL, NULL),
(402, NULL, 388, 1, NULL, NULL),
(403, NULL, 389, 1, NULL, NULL),
(404, NULL, 390, 1, NULL, NULL),
(405, NULL, 391, 1, NULL, NULL),
(406, NULL, 392, 1, NULL, NULL),
(407, NULL, 393, 1, NULL, NULL),
(408, NULL, 394, 1, NULL, NULL),
(409, NULL, 395, 1, NULL, NULL),
(410, NULL, 396, 1, NULL, NULL),
(411, NULL, 397, 1, NULL, NULL),
(412, NULL, 398, 1, NULL, NULL),
(413, NULL, 399, 1, NULL, NULL),
(414, NULL, 400, 1, NULL, NULL),
(415, NULL, 401, 1, NULL, NULL),
(416, NULL, 402, 1, NULL, NULL),
(417, NULL, 403, 1, NULL, NULL),
(418, NULL, 404, 1, NULL, NULL),
(419, NULL, 405, 1, NULL, NULL),
(420, NULL, 406, 1, NULL, NULL),
(421, NULL, 407, 1, NULL, NULL),
(422, NULL, 408, 1, NULL, NULL),
(423, NULL, 409, 1, NULL, NULL),
(424, NULL, 410, 1, NULL, NULL),
(425, NULL, 411, 1, NULL, NULL),
(426, NULL, 412, 1, NULL, NULL),
(427, NULL, 413, 1, NULL, NULL),
(428, NULL, 414, 1, NULL, NULL),
(429, NULL, 415, 1, NULL, NULL),
(430, NULL, 416, 1, NULL, NULL),
(431, NULL, 417, 1, NULL, NULL),
(432, NULL, 418, 1, NULL, NULL),
(433, NULL, 419, 1, NULL, NULL),
(434, NULL, 420, 1, NULL, NULL),
(435, NULL, 421, 1, NULL, NULL),
(436, NULL, 422, 1, NULL, NULL),
(437, NULL, 423, 1, NULL, NULL),
(438, NULL, 424, 1, NULL, NULL),
(439, NULL, 425, 1, NULL, NULL),
(440, NULL, 426, 1, NULL, NULL),
(441, NULL, 427, 1, NULL, NULL),
(442, NULL, 428, 1, NULL, NULL),
(443, NULL, 429, 1, NULL, NULL),
(444, NULL, 430, 1, NULL, NULL),
(445, NULL, 431, 1, NULL, NULL),
(446, NULL, 432, 1, NULL, NULL),
(447, NULL, 433, 1, NULL, NULL),
(448, NULL, 434, 1, NULL, NULL),
(449, NULL, 435, 1, NULL, NULL),
(450, NULL, 436, 1, NULL, NULL),
(451, NULL, 437, 2, NULL, NULL),
(452, NULL, 438, 1, NULL, NULL),
(453, NULL, 439, 1, NULL, NULL),
(454, NULL, 440, 1, NULL, NULL),
(455, NULL, 441, 1, NULL, NULL),
(456, NULL, 442, 1, NULL, NULL),
(457, NULL, 443, 1, NULL, NULL),
(458, NULL, 444, 1, NULL, NULL),
(459, NULL, 445, 1, NULL, NULL),
(460, NULL, 446, 1, NULL, NULL),
(461, NULL, 447, 1, NULL, NULL),
(462, NULL, 448, 1, NULL, NULL),
(463, NULL, 449, 1, NULL, NULL),
(464, NULL, 450, 2, NULL, NULL),
(465, NULL, 451, 1, NULL, NULL),
(466, NULL, 452, 1, NULL, NULL),
(467, NULL, 453, 1, NULL, NULL),
(468, NULL, 454, 1, NULL, NULL),
(469, NULL, 455, 1, NULL, NULL),
(470, NULL, 456, 1, NULL, NULL),
(471, NULL, 457, 1, NULL, NULL),
(472, NULL, 458, 1, NULL, NULL),
(473, NULL, 459, 1, NULL, NULL),
(474, NULL, 460, 1, NULL, NULL),
(475, NULL, 461, 1, NULL, NULL),
(476, NULL, 462, 1, NULL, NULL),
(477, NULL, 463, 1, NULL, NULL),
(478, NULL, 464, 2, NULL, NULL),
(479, NULL, 465, 1, NULL, NULL),
(480, NULL, 466, 1, NULL, NULL),
(481, NULL, 467, 1, NULL, NULL),
(482, NULL, 468, 1, NULL, NULL),
(483, NULL, 469, 1, NULL, NULL),
(484, NULL, 470, 1, NULL, NULL),
(485, NULL, 471, 1, NULL, NULL),
(486, NULL, 472, 1, NULL, NULL),
(487, NULL, 473, 1, NULL, NULL),
(488, NULL, 474, 1, NULL, NULL),
(489, NULL, 475, 2, NULL, NULL),
(490, NULL, 476, 2, NULL, NULL),
(491, NULL, 477, 2, NULL, NULL),
(492, NULL, 478, 2, NULL, NULL),
(493, NULL, 479, 1, NULL, NULL),
(494, NULL, 480, 2, NULL, NULL),
(495, NULL, 481, 1, NULL, NULL),
(496, NULL, 482, 2, NULL, NULL),
(497, NULL, 483, 2, NULL, NULL),
(498, NULL, 484, 1, NULL, NULL),
(499, NULL, 485, 1, NULL, NULL),
(500, NULL, 486, 1, NULL, NULL),
(501, NULL, 487, 1, NULL, NULL),
(502, NULL, 488, 1, NULL, NULL),
(503, NULL, 489, 14, NULL, NULL),
(504, NULL, 490, 15, NULL, NULL),
(505, NULL, 491, 15, NULL, NULL),
(506, NULL, 492, 15, NULL, NULL),
(507, NULL, 493, 15, NULL, NULL),
(508, NULL, 494, 15, NULL, NULL),
(509, NULL, 495, 16, NULL, NULL),
(510, NULL, 496, 17, NULL, NULL),
(511, NULL, 497, 19, NULL, NULL),
(512, NULL, 498, 20, NULL, NULL),
(513, NULL, 499, 1, NULL, NULL),
(514, NULL, 500, 1, NULL, NULL),
(515, NULL, 501, 1, NULL, NULL),
(516, NULL, 502, 2, NULL, NULL),
(517, NULL, 503, 1, NULL, NULL),
(518, NULL, 504, 1, NULL, NULL),
(519, NULL, 505, 21, NULL, NULL),
(520, NULL, 506, 21, NULL, NULL),
(521, NULL, 507, 1, NULL, NULL),
(522, NULL, 508, 1, NULL, NULL),
(523, NULL, 509, 22, NULL, NULL),
(524, NULL, 510, 1, NULL, NULL),
(525, NULL, 511, 1, NULL, NULL),
(526, NULL, 512, 2, NULL, NULL),
(527, NULL, 513, 1, NULL, NULL),
(528, NULL, 514, 1, NULL, NULL),
(529, NULL, 515, 23, NULL, NULL),
(530, NULL, 516, 19, NULL, NULL),
(531, NULL, 517, 19, NULL, NULL),
(532, NULL, 518, 19, NULL, NULL),
(533, NULL, 519, 19, NULL, NULL),
(534, NULL, 520, 19, NULL, NULL),
(535, NULL, 521, 19, NULL, NULL),
(536, NULL, 522, 19, NULL, NULL),
(537, NULL, 523, 19, NULL, NULL),
(538, NULL, 524, 19, NULL, NULL),
(539, NULL, 525, 19, NULL, NULL),
(540, NULL, 526, 19, NULL, NULL),
(541, NULL, 527, 19, NULL, NULL),
(542, NULL, 528, 19, NULL, NULL),
(543, NULL, 529, 1, NULL, NULL),
(544, NULL, 530, 1, NULL, NULL),
(545, NULL, 531, 1, NULL, NULL),
(546, NULL, 532, 2, NULL, NULL),
(547, NULL, 533, 1, NULL, NULL),
(548, NULL, 534, 25, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `machine_models`
--

CREATE TABLE `machine_models` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `machine_id` int(11) NOT NULL,
  `make_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_models`
--

INSERT INTO `machine_models` (`id`, `user_id`, `name`, `machine_id`, `make_id`, `created_at`, `updated_at`) VALUES
(1, 3, 'Solar 130-V', 1, 1, '2024-07-09 08:13:11', '2024-07-09 08:13:11'),
(2, 3, 'S140-V', 1, 1, '2024-07-09 08:13:32', '2024-07-09 08:13:32'),
(3, 3, 'DX140', 1, 1, '2024-07-09 08:13:59', '2024-07-09 08:13:59'),
(4, 3, 'EX-200', 1, 4, '2024-07-09 09:12:52', '2024-07-09 09:12:52'),
(5, 3, 'UNIVERSAL', 2, 6, '2024-07-09 10:40:52', '2024-07-09 10:40:52'),
(6, 3, 'EX-100', 1, 4, '2024-07-10 07:41:19', '2024-07-10 07:41:19'),
(7, 3, '130', 1, 2, '2024-07-10 11:03:45', '2024-07-10 11:03:45'),
(8, 3, '132', 1, 5, '2024-07-10 11:47:13', '2024-07-10 11:47:13'),
(9, 3, 'S-130-III', 1, 1, '2024-07-10 11:49:45', '2024-07-10 11:49:45'),
(10, 3, 'S-225', 1, 1, '2024-07-10 13:59:24', '2024-07-10 13:59:24'),
(11, 3, 'R-1400', 1, 3, '2024-07-12 04:53:13', '2024-07-12 04:53:13'),
(12, 3, 'FH-200', 1, 4, '2024-07-18 11:42:04', '2024-07-18 11:42:04'),
(13, 3, 'S80-2', 1, 1, '2024-07-20 11:12:59', '2024-07-20 11:12:59'),
(19, 3, '7-7', 1, 4, '2024-08-03 09:16:41', '2024-08-03 09:16:41'),
(20, 3, 'DX-225', 1, 1, '2024-08-03 09:39:49', '2024-08-03 09:39:49'),
(21, 6, 'R1400-9', 9, 16, '2024-08-05 08:30:25', '2024-08-05 08:30:25'),
(22, 3, 'EX200-5', 1, 4, '2024-08-05 09:32:41', '2024-08-05 09:32:41'),
(23, 3, 'S-300', 1, 1, '2024-08-08 10:33:31', '2024-08-08 10:33:31'),
(24, 3, 'S-170', 1, 1, '2024-08-11 13:39:22', '2024-08-11 13:39:22'),
(25, 8, 'modeltest', 10, 20, '2024-08-22 10:43:32', '2024-08-22 10:43:32'),
(26, 10, 'RS turbo', 11, 21, '2024-08-26 06:46:02', '2024-08-26 06:46:02'),
(27, 11, 'wtr', 12, 24, '2024-08-28 08:21:08', '2024-08-28 08:21:08'),
(28, 13, 'dffdsf', 13, 25, '2024-08-30 10:54:26', '2024-08-30 10:54:26'),
(29, 3, 'EW-170', 1, 2, '2024-09-08 05:40:19', '2024-09-08 05:40:19'),
(30, 3, 'JCB 200', 1, 26, '2024-09-11 10:53:39', '2024-09-11 10:53:39'),
(31, 3, 'UNIVERSAL', 1, 1, '2024-09-15 05:20:09', '2024-09-15 05:20:09'),
(32, 3, 'EX-300', 1, 4, '2024-09-19 11:15:28', '2024-09-19 11:15:28'),
(33, 3, 'ZX-200', 1, 4, '2024-09-24 12:08:29', '2024-09-24 12:08:29'),
(34, 3, 'EW145 Prime', 1, 2, '2024-10-02 12:25:51', '2024-10-02 12:25:51'),
(35, 3, '55-W', 1, 1, '2024-10-02 13:01:10', '2024-10-02 13:01:10'),
(36, 3, 'EX-270', 1, 4, '2024-10-09 12:42:56', '2024-10-09 12:42:56'),
(37, 11, 'H 6', 14, 28, '2024-10-17 05:48:02', '2024-10-17 05:48:02'),
(38, 11, 'H9', 16, 32, '2024-10-18 05:14:19', '2024-10-18 05:14:19'),
(39, 11, 'CD70', 17, 33, '2024-10-18 05:35:05', '2024-10-18 05:35:05'),
(40, 19, 'CD70', 19, 35, '2024-10-18 08:06:40', '2024-10-18 08:06:40'),
(43, 19, 'H6', 20, 36, '2024-10-18 11:15:59', '2024-10-18 11:15:59'),
(44, 3, 'EX-160', 1, 4, '2024-10-19 12:28:07', '2024-10-19 12:28:07'),
(45, 19, 'MODEL X', 21, 37, '2024-10-21 03:50:28', '2024-10-21 03:50:28'),
(46, 19, 'VX', 22, 38, '2024-10-22 07:25:54', '2024-10-22 07:25:54'),
(47, 3, 'ZX-450', 1, 4, '2024-10-23 13:33:39', '2024-10-23 13:33:39'),
(48, 19, 'Honda 125', 23, 35, '2024-10-25 10:12:33', '2024-10-25 10:12:33'),
(49, 19, 'Yamaha YBR 125G', 19, 40, '2024-10-25 10:55:39', '2024-10-25 10:55:39'),
(50, 19, 'YBR 125G', 19, 40, '2024-10-25 10:56:16', '2024-10-25 10:56:16'),
(51, 19, 'YBR 125G', 19, 40, '2024-10-25 10:57:32', '2024-10-25 10:57:32'),
(52, 19, 'GR 150', 19, 41, '2024-10-25 11:13:19', '2024-10-25 11:13:19'),
(53, 19, 'RX3', 19, 42, '2024-10-25 11:53:22', '2024-10-25 11:53:22'),
(54, 27, '2000', 24, 43, '2024-10-28 12:03:05', '2024-10-28 12:03:05'),
(55, 27, '2000', 24, 44, '2024-10-28 12:04:41', '2024-10-28 12:04:41'),
(56, 14, 'ghf', 25, 45, '2024-12-17 09:17:15', '2024-12-17 09:17:15');

-- --------------------------------------------------------

--
-- Table structure for table `machine_parts`
--

CREATE TABLE `machine_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `application_id` int(11) DEFAULT NULL,
  `type_id` int(11) NOT NULL,
  `uom_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_parts`
--

INSERT INTO `machine_parts` (`id`, `user_id`, `name`, `sub_category_id`, `application_id`, `type_id`, `uom_id`, `created_at`, `updated_at`) VALUES
(1, 3, 'BOOM KIT', 1, 1, 1, 2, '2024-07-09 08:22:19', '2024-07-09 08:22:19'),
(2, 3, 'ARM KIT', 1, 1, 1, 2, '2024-07-09 08:23:21', '2024-07-09 08:23:21'),
(3, 3, 'BUCKET KIT', 1, 1, 1, 2, '2024-07-09 08:24:02', '2024-07-09 08:24:02'),
(4, 3, 'DOZER KIT', 1, 1, 1, 2, '2024-07-09 08:24:53', '2024-07-09 08:24:53'),
(5, 3, 'RAM KIT', 1, 1, 1, 2, '2024-07-09 08:25:35', '2024-07-09 08:25:35'),
(6, 3, 'STEARING JACK KIT', 1, 1, 1, 2, '2024-07-09 08:26:25', '2024-07-09 08:26:25'),
(7, 3, 'SHIKANJA KIT', 1, 1, 1, 2, '2024-07-09 08:27:34', '2024-07-09 08:27:34'),
(8, 3, 'LEVER KIT', 1, 2, 1, 2, '2024-07-09 08:29:25', '2024-07-09 08:29:25'),
(9, 3, 'VALVE PLATE', 3, 5, 1, 2, '2024-07-09 09:18:42', '2024-07-09 09:18:42'),
(10, 3, 'VALVE PLATE SWING', 3, 6, 1, 2, '2024-07-09 09:24:20', '2024-07-09 09:24:20'),
(11, 3, 'SET PLATE SWING', 3, 6, 1, 2, '2024-07-09 09:26:51', '2024-07-09 09:26:51'),
(12, 3, 'PISTON SHOE PUMP', 3, 5, 1, 2, '2024-07-09 09:57:22', '2024-07-09 09:57:22'),
(13, 3, 'PUMP KIT', 1, 7, 1, 2, '2024-07-09 09:59:07', '2024-07-09 09:59:07'),
(14, 3, 'DC FAN', 4, 8, 1, 2, '2024-07-09 10:45:23', '2024-07-09 10:45:23'),
(15, 3, 'CENTRE JOINT KIT', 1, 9, 1, 2, '2024-07-10 07:51:21', '2024-07-10 07:51:21'),
(16, 3, 'COIL SPRING', 3, 5, 1, 2, '2024-07-10 07:55:50', '2024-07-10 07:55:50'),
(17, 3, 'SET PLATE PUMP', 3, 5, 1, 2, '2024-07-10 08:00:54', '2024-07-10 08:00:54'),
(18, 3, 'CYLINDER BLOCK', 3, 5, 1, 2, '2024-07-10 10:53:20', '2024-07-10 10:53:20'),
(19, 3, 'SWASH PLATE', 3, 5, 1, 2, '2024-07-10 10:56:44', '2024-07-10 10:56:44'),
(20, 3, 'TILTING PIN', 3, 5, 1, 2, '2024-07-10 10:58:12', '2024-07-10 10:58:12'),
(21, 3, 'SHOE PLATE', 3, 5, 1, 2, '2024-07-10 10:58:46', '2024-07-10 10:58:46'),
(22, 3, 'BALL GUIDE', 3, 5, 1, 2, '2024-07-10 10:59:10', '2024-07-10 10:59:10'),
(23, 3, 'DRIVE SHAFT', 3, 5, 1, 2, '2024-07-10 10:59:37', '2024-07-10 10:59:37'),
(24, 3, 'REGULATOR', 3, 5, 1, 2, '2024-07-10 11:00:40', '2024-07-10 11:00:40'),
(25, 3, 'HYDRAULIC FILTER', 5, 10, 1, 2, '2024-07-10 11:44:46', '2024-07-10 11:44:46'),
(26, 3, 'AIR FILTER', 10, 11, 1, 2, '2024-07-10 12:03:05', '2024-07-10 12:03:05'),
(27, 3, 'GREES ADAPTER', 11, 12, 1, 2, '2024-07-10 12:17:31', '2024-07-10 12:17:31'),
(28, 3, 'HORN', 11, 8, 1, 2, '2024-07-10 12:23:41', '2024-07-10 12:23:41'),
(29, 3, 'HORN', 12, 8, 1, 2, '2024-07-10 12:32:42', '2024-07-10 12:32:42'),
(30, 3, 'LIGHT COVER BACK', 12, 8, 1, 2, '2024-07-10 12:34:33', '2024-07-10 12:34:33'),
(31, 3, 'BULB', 12, 8, 1, 2, '2024-07-10 12:36:00', '2024-07-10 12:36:00'),
(32, 3, 'FUEZ', 12, 8, 1, 2, '2024-07-10 12:37:13', '2024-07-10 12:37:13'),
(33, 3, 'FLASHER', 12, 8, 1, 2, '2024-07-10 12:42:12', '2024-07-10 12:42:12'),
(34, 3, 'SENSOR', 12, 13, 1, 2, '2024-07-10 12:44:30', '2024-07-10 12:44:30'),
(35, 3, 'TAIP', 12, 14, 1, 2, '2024-07-10 13:51:16', '2024-07-10 13:51:16'),
(36, 3, 'GEAR PUMP', 3, 5, 1, 2, '2024-07-10 14:00:13', '2024-07-10 14:00:13'),
(37, 3, 'T/M SEAL KIT', 1, 15, 1, 2, '2024-07-10 14:08:39', '2024-07-10 14:08:39'),
(38, 3, 'END SHIM', 13, 16, 1, 2, '2024-07-10 14:29:45', '2024-07-10 14:29:45'),
(39, 3, 'LOCK', 13, 16, 1, 2, '2024-07-10 14:31:47', '2024-07-10 14:31:47'),
(40, 3, 'Water Separator Filter', 6, 11, 1, 2, '2024-07-12 02:34:11', '2024-07-12 02:34:11'),
(41, 3, 'FUEL FILTER', 6, 11, 1, 2, '2024-07-12 02:56:13', '2024-07-12 02:56:13'),
(42, 3, 'OIL FILTER', 7, 11, 1, 2, '2024-07-12 02:56:50', '2024-07-12 02:56:50'),
(43, 3, 'PILOT FILTER', 5, 10, 1, 2, '2024-07-12 02:57:55', '2024-07-12 02:57:55'),
(44, 3, 'BRAKE FILTER', 5, 10, 1, 2, '2024-07-12 02:58:56', '2024-07-12 02:58:56'),
(45, 3, 'SUCTION FILTER', 5, 10, 1, 2, '2024-07-12 03:04:31', '2024-07-12 03:04:31'),
(46, 3, 'SHAFT BERING', 14, 17, 1, 2, '2024-07-12 03:44:57', '2024-07-12 03:44:57'),
(47, 3, 'ASSYMBLY KIT BOX', 1, 13, 1, 2, '2024-07-12 03:57:42', '2024-07-12 03:57:42'),
(48, 3, 'HOUSING BERING', 14, 18, 1, 2, '2024-07-12 04:05:46', '2024-07-12 04:05:46'),
(49, 3, 'CUP BUSH', 15, 19, 1, 2, '2024-07-12 04:12:13', '2024-07-12 04:12:13'),
(50, 3, 'SWING DEVICE SEAL', 1, 6, 1, 2, '2024-07-12 04:31:12', '2024-07-12 04:31:12'),
(51, 3, 'BELLOW SEAL', 1, 20, 1, 2, '2024-07-12 04:32:21', '2024-07-12 04:32:21'),
(52, 3, 'HYDRAULIC GAUGE', 11, 12, 1, 2, '2024-07-12 04:34:35', '2024-07-12 04:34:35'),
(53, 3, 'JACK HAMMER KIT', 1, 21, 1, 2, '2024-07-12 04:36:22', '2024-07-12 04:36:22'),
(54, 3, 'TURBO CHARGER', 16, 22, 1, 2, '2024-07-12 04:39:59', '2024-07-12 04:39:59'),
(55, 3, 'CHAIN ADAPTER', 17, 23, 1, 2, '2024-07-12 08:10:51', '2024-07-12 08:10:51'),
(56, 3, 'RACE CABLE', 11, 12, 1, 2, '2024-07-12 08:12:00', '2024-07-12 08:12:00'),
(57, 3, 'HAMMER GASS GAUGE', 13, 21, 1, 2, '2024-07-12 08:13:16', '2024-07-12 08:13:16'),
(58, 3, 'ANGLE LOCK', 13, 16, 1, 2, '2024-07-12 09:36:16', '2024-07-12 09:36:16'),
(59, 3, 'RETAINING RING-DANDI LOCK', 13, 16, 1, 2, '2024-07-12 09:37:36', '2024-07-12 09:37:36'),
(60, 3, 'THRUST WASHEL', 13, 16, 1, 2, '2024-07-12 09:38:25', '2024-07-12 09:38:25'),
(61, 3, 'RACE PEDAL KIT', 1, 24, 1, 2, '2024-07-12 09:42:20', '2024-07-12 13:47:57'),
(62, 3, 'LEVER SPOOL', 3, 8, 1, 2, '2024-07-12 09:45:02', '2024-07-12 09:45:02'),
(63, 3, 'GODA SEAL', 1, 16, 1, 2, '2024-07-12 09:48:14', '2024-07-12 09:48:14'),
(64, 3, 'WHEEL GEAR BERING', 13, 16, 1, 2, '2024-07-12 09:50:20', '2024-07-12 09:50:20'),
(65, 3, 'CHAIN ADJUSTER KIT', 1, 23, 1, 2, '2024-07-12 09:54:18', '2024-07-12 09:54:18'),
(66, 3, 'PILOT PUMP KIT', 1, 5, 1, 2, '2024-07-12 13:00:30', '2024-07-12 13:00:30'),
(67, 3, 'LEVER CROSS', 3, 2, 1, 2, '2024-07-13 04:36:40', '2024-07-13 04:36:40'),
(68, 3, 'BRAKE KIT', 1, 16, 1, 2, '2024-07-13 04:42:19', '2024-07-13 04:42:19'),
(69, 3, 'COUPLING RUBBER', 3, 5, 1, 2, '2024-07-13 04:43:42', '2024-07-13 04:44:22'),
(70, 3, 'RACE & BRAKE SPOOL', 3, 8, 1, 2, '2024-07-13 06:12:45', '2024-07-13 06:12:45'),
(71, 3, 'BLADE SPOOL', 3, 8, 1, 2, '2024-07-13 06:14:02', '2024-07-13 06:14:02'),
(72, 3, 'HUB SEAL', 1, 16, 1, 2, '2024-07-13 06:14:56', '2024-07-13 06:14:56'),
(73, 3, 'CRAWLING SPOOL', 3, 4, 1, 2, '2024-07-13 06:16:25', '2024-07-13 06:16:25'),
(74, 3, 'SWING MOTOR KIT', 1, 6, 1, 2, '2024-07-13 06:18:52', '2024-07-13 06:18:52'),
(75, 3, 'CROSS', 13, 16, 1, 2, '2024-07-13 06:20:09', '2024-07-13 06:20:09'),
(76, 3, 'GODA BUSH', 13, 16, 1, 2, '2024-07-13 06:47:28', '2024-07-13 06:47:28'),
(77, 3, 'GODA BERING', 13, 16, 1, 2, '2024-07-13 07:00:50', '2024-07-13 07:00:50'),
(78, 3, 'O-RING', 1, 12, 1, 2, '2024-07-13 07:37:34', '2024-07-13 07:37:34'),
(79, 3, 'HUB BERING', 13, 16, 1, 2, '2024-07-13 12:39:42', '2024-07-13 12:39:42'),
(80, 3, 'ASSYMBLY KIT', 1, 13, 1, 2, '2024-07-13 13:10:01', '2024-07-13 13:10:01'),
(81, 3, 'WHEEL GEAR', 13, 16, 1, 2, '2024-07-13 13:15:57', '2024-07-13 13:15:57'),
(82, 3, 'COUPLING COMPLETE', 3, 5, 1, 2, '2024-07-13 13:22:56', '2024-07-13 13:22:56'),
(83, 3, 'SUN GEAR', 13, 16, 1, 2, '2024-07-13 13:25:49', '2024-07-13 13:25:49'),
(84, 3, 'PL-2 GEAR', 3, 6, 1, 2, '2024-07-14 05:11:22', '2024-07-14 05:11:22'),
(85, 3, 'PL-2 SUN GEAR', 3, 6, 1, 2, '2024-07-14 05:11:51', '2024-07-14 05:11:51'),
(86, 3, 'T/M LEATHER PLATE', 3, 15, 1, 2, '2024-07-14 05:42:44', '2024-07-14 05:42:44'),
(87, 3, 'INNER DRUM', 13, 16, 1, 2, '2024-07-14 05:47:49', '2024-07-14 05:47:49'),
(88, 3, 'DEASEL JALI', 6, 11, 1, 2, '2024-07-14 08:04:08', '2024-07-14 08:04:08'),
(89, 3, 'ENGINE FOUNDATION', 16, 22, 1, 2, '2024-07-14 08:05:30', '2024-07-14 08:05:30'),
(90, 3, 'SHEET LOCK', 18, 25, 1, 2, '2024-07-14 08:09:10', '2024-07-14 08:09:10'),
(91, 3, 'LIFTY PUMP', 16, 22, 1, 2, '2024-07-14 08:12:31', '2024-07-14 08:12:31'),
(92, 3, 'FUEL CAP', 16, 22, 1, 2, '2024-07-14 08:14:58', '2024-07-14 08:14:58'),
(93, 3, 'PISTON SHOE SWING', 3, 6, 1, 2, '2024-07-14 08:27:16', '2024-07-14 08:27:16'),
(94, 3, 'BRAKE STEERING PUMP', 3, 5, 1, 2, '2024-07-14 08:44:21', '2024-07-14 08:44:21'),
(95, 3, 'T/M STEEL PLATE', 3, 15, 1, 2, '2024-07-14 10:10:51', '2024-07-14 10:10:51'),
(96, 3, 'GUIDE SPACER', 3, 6, 1, 2, '2024-07-15 17:35:07', '2024-07-15 17:35:07'),
(97, 3, 'COIL', 12, 13, 1, 2, '2024-07-16 10:43:47', '2024-07-16 10:43:47'),
(98, 3, 'ARM PIN', 18, 23, 1, 2, '2024-07-17 08:54:18', '2024-07-17 08:54:18'),
(99, 3, 'PIN BUSH', 18, 23, 1, 2, '2024-07-17 09:01:20', '2024-07-17 09:01:20'),
(100, 3, 'PIN', 18, 23, 1, 2, '2024-07-17 09:02:30', '2024-07-17 09:02:30'),
(101, 3, 'BUCKET TEETH', 18, 23, 1, 2, '2024-07-18 10:55:45', '2024-07-18 10:55:45'),
(102, 3, 'TEETH PIN&WASHEL', 18, 23, 1, 2, '2024-07-18 10:56:22', '2024-07-18 10:56:22'),
(103, 3, 'BUCKET ADAPTER', 18, 23, 1, 2, '2024-07-18 10:57:04', '2024-07-18 10:57:04'),
(104, 3, 'BUCKET SIDE CUTTER', 18, 23, 1, 2, '2024-07-18 10:57:39', '2024-07-18 10:57:39'),
(105, 3, 'CRAWLING MOTOR KIT', 1, 20, 1, 2, '2024-07-18 11:45:20', '2024-07-18 11:45:20'),
(106, 3, 'SEAL', 1, 7, 1, 2, '2024-07-20 09:36:59', '2024-07-20 09:36:59'),
(107, 3, 'VALVE', 3, 13, 1, 2, '2024-07-20 10:02:25', '2024-07-20 10:02:25'),
(108, 3, 'WHEEL LEATHER PLATE', 13, 16, 1, 2, '2024-07-20 10:21:06', '2024-07-20 10:21:06'),
(109, 3, 'WHEEL STEEL PLATE', 13, 16, 1, 2, '2024-07-20 10:43:07', '2024-07-20 10:43:07'),
(110, 3, 'ROUTER LIGHT', 12, 8, 1, 2, '2024-07-20 11:44:30', '2024-07-20 11:44:30'),
(111, 3, 'HAMMER PIPE VALVE', 13, 21, 1, 2, '2024-07-20 12:52:57', '2024-07-20 12:52:57'),
(112, 3, 'WEIST COTTON', 11, 12, 1, 2, '2024-07-20 12:56:10', '2024-07-20 12:56:10'),
(113, 3, 'ENGINE OIL', 19, 26, 1, 3, '2024-07-20 12:58:19', '2024-07-20 12:58:19'),
(114, 3, 'AIR FILTER', 10, 27, 1, 2, '2024-07-20 13:18:43', '2024-07-20 13:18:43'),
(115, 3, 'AIR CLINDER PIPE', 16, 26, 1, 2, '2024-07-20 13:26:08', '2024-07-20 13:26:08'),
(116, 3, 'SILICON', 11, 12, 1, 2, '2024-07-22 11:02:02', '2024-07-22 11:02:02'),
(117, 3, 'CRAWLING PLANTRY', 3, 20, 1, 2, '2024-07-22 11:05:48', '2024-07-22 11:05:48'),
(118, 3, 'PLANTRY SHAFT', 3, 20, 1, 2, '2024-07-22 11:06:25', '2024-07-22 11:06:25'),
(119, 3, 'LEVER UNIT', 3, 8, 1, 2, '2024-07-22 13:31:14', '2024-07-22 13:31:14'),
(120, 3, 'PANA', 11, 1, 1, 2, '2024-07-27 08:00:12', '2024-07-27 08:00:12'),
(124, 6, 'Oil Filter', 24, 31, 1, 2, '2024-08-05 08:34:49', '2024-08-05 08:34:49'),
(125, 3, 'O-RING', 1, 12, 1, 2, '2024-08-07 05:08:22', '2024-08-07 05:08:22'),
(126, 3, 'HAMMER NUT', 13, 21, 1, 2, '2024-08-07 06:37:04', '2024-08-07 06:37:04'),
(127, 3, 'DRIVE SHAFT LONG', 3, 5, 1, 2, '2024-08-07 09:44:11', '2024-08-07 09:44:11'),
(128, 3, 'DRIVE SHAFT SHORT', 3, 5, 1, 2, '2024-08-07 09:45:12', '2024-08-07 09:45:12'),
(129, 3, 'BRAKE PEDAL KIT', 1, 33, 1, 2, '2024-08-07 10:36:12', '2024-08-07 10:36:12'),
(130, 3, 'PISTON PATTI', 1, 33, 1, 2, '2024-08-07 10:42:27', '2024-08-07 10:42:27'),
(131, 3, 'PUMP LOCK', 3, 5, 1, 2, '2024-08-07 12:53:08', '2024-08-07 12:53:08'),
(132, 3, 'BOLT OF V-PLATE', 3, 5, 1, 2, '2024-08-07 12:56:32', '2024-08-07 12:56:32'),
(133, 3, 'CHECK NUT', 3, 5, 1, 2, '2024-08-07 13:04:04', '2024-08-07 13:04:04'),
(134, 3, 'REGULATOR', 3, 5, 1, 2, '2024-08-08 10:56:40', '2024-08-08 10:56:40'),
(135, 3, 'MEGIC', 11, 32, 1, 2, '2024-08-11 07:00:34', '2024-08-11 07:00:34'),
(136, 3, 'GEAR OIL', 19, 20, 1, 2, '2024-08-11 07:02:08', '2024-08-11 07:02:08'),
(137, 6, 'Head Light Right', 25, 31, 1, 2, '2024-08-12 09:46:39', '2024-08-12 09:46:39'),
(138, 8, 'testingItems', 26, 34, 2, 4, '2024-08-22 10:45:21', '2024-08-22 10:45:21'),
(139, 10, 'coil cable', 27, 35, 1, 3, '2024-08-26 06:49:40', '2024-08-26 06:49:40'),
(140, 8, 'errrrrrr', 26, 34, 1, 1, '2024-08-26 10:43:11', '2024-08-26 10:43:11'),
(141, 11, 'xvxcvxw44', 30, 36, 1, 4, '2024-08-28 08:22:37', '2024-10-18 05:07:38'),
(142, 13, 'hgfhghgf', 29, 37, 1, 1, '2024-08-30 10:55:58', '2024-08-30 10:55:58'),
(143, 3, 'OUTER DRUM', 13, 1, 1, 2, '2024-09-08 05:44:29', '2024-09-08 05:44:29'),
(144, 3, 'GEAR PIN', 3, 2, 1, 2, '2024-09-09 11:59:52', '2024-09-09 11:59:52'),
(145, 3, 'WHEEL BOLT', 13, 1, 1, 2, '2024-09-09 12:20:58', '2024-09-09 12:20:58'),
(146, 3, 'ROTOR PIN', 3, 2, 1, 2, '2024-09-09 12:33:09', '2024-09-09 12:33:09'),
(147, 3, 'ROTOR SPRING LOCK', 3, 2, 1, 2, '2024-09-09 12:35:07', '2024-09-09 12:35:07'),
(148, 3, 'LEATHER PLATE SWING', 3, 2, 1, 2, '2024-09-09 12:45:22', '2024-09-09 12:45:22'),
(149, 3, 'STEEL PLATE SWING', 3, 2, 1, 2, '2024-09-09 12:45:45', '2024-09-09 12:45:45'),
(150, 3, 'SMALL SHIM', 13, 1, 1, 2, '2024-09-09 13:24:08', '2024-09-09 13:24:08'),
(151, 3, 'INNER DRUM LOCK', 13, 1, 1, 2, '2024-09-10 06:06:16', '2024-09-10 06:06:16'),
(152, 3, 'TAI ROD NUT', 13, 1, 1, 2, '2024-09-10 06:11:44', '2024-09-10 06:11:44'),
(153, 3, 'FOOT JACK KIT', 1, 3, 1, 2, '2024-09-11 10:59:50', '2024-09-11 10:59:50'),
(154, 3, 'JACK CYLINDER KIT', 1, 3, 1, 2, '2024-09-11 11:00:27', '2024-09-11 11:00:27'),
(155, 3, 'PISTON PATTI', 1, 3, 1, 2, '2024-09-11 11:16:34', '2024-09-11 11:16:34'),
(156, 3, 'PISTON KIT', 1, 3, 1, 2, '2024-09-11 11:17:09', '2024-09-11 11:17:09'),
(157, 3, 'SERVO PISTON PIN', 3, 4, 1, 2, '2024-09-11 11:23:18', '2024-09-11 11:23:18'),
(158, 3, 'REGULATOR PIN', 3, 4, 1, 2, '2024-09-11 11:27:41', '2024-09-11 11:27:41'),
(159, 3, 'WATER BODY', 16, 5, 1, 2, '2024-09-14 13:23:41', '2024-09-14 13:23:41'),
(160, 3, 'PUMP BERING', 3, 4, 1, 2, '2024-09-19 11:27:47', '2024-09-19 11:27:47'),
(161, 3, 'FAN BELT', 16, 5, 1, 2, '2024-09-22 04:47:16', '2024-09-22 04:47:16'),
(162, 3, 'K-2', 19, 6, 1, 3, '2024-09-22 04:58:35', '2024-09-22 04:58:35'),
(163, 3, 'MAIN RELEIFE VALVE', 3, 4, 1, 2, '2024-09-22 06:35:34', '2024-09-22 06:35:34'),
(164, 3, 'HOUSING SEAL', 1, 7, 1, 2, '2024-09-24 05:24:36', '2024-09-24 05:24:36'),
(165, 3, 'FRONT AXCEL', 17, 1, 1, 2, '2024-10-02 12:54:29', '2024-10-02 12:54:29'),
(166, 3, 'PIPE', 11, 7, 1, 2, '2024-10-12 13:21:58', '2024-10-12 13:21:58'),
(167, 3, 'GODA PIPE', 11, 7, 1, 2, '2024-10-12 13:28:05', '2024-10-12 13:28:05'),
(168, 3, 'U-PIPE', 11, 7, 1, 2, '2024-10-12 13:29:10', '2024-10-12 13:29:10'),
(169, 3, 'HYDRAULIC OIL', 19, 8, 1, 3, '2024-10-14 05:04:43', '2024-10-14 05:04:43'),
(170, 11, 'Front Right Headlight', 31, NULL, 1, 2, '2024-10-17 05:49:56', '2024-10-17 05:49:56'),
(171, 11, 'wind shield', 32, 9, 1, 2, '2024-10-17 08:11:25', '2024-10-17 08:11:25'),
(172, 11, 'wind shield', 32, 9, 1, 2, '2024-10-17 08:38:13', '2024-10-17 08:38:13'),
(173, 11, 'wind shield', 32, 9, 1, 2, '2024-10-17 08:54:22', '2024-10-17 08:54:22'),
(174, 11, 'Haval', 32, 9, 1, 2, '2024-10-17 09:48:10', '2024-10-17 09:48:10'),
(175, 11, 'DOR', 33, 10, 1, 2, '2024-10-18 05:24:30', '2024-10-18 05:24:30'),
(176, 11, 'TYRE', 35, 10, 1, 2, '2024-10-18 05:37:02', '2024-10-18 05:37:02'),
(177, 19, 'BIKE TYRE', 36, 11, 1, 2, '2024-10-18 08:10:04', '2024-10-18 08:10:04'),
(178, 19, 'WINDSHEILD', 38, 11, 1, 2, '2024-10-18 11:19:05', '2024-10-18 11:19:05'),
(179, 3, 'GASS TEE', 13, 12, 1, 2, '2024-10-19 11:24:51', '2024-10-19 11:24:51'),
(180, 3, 'SWING DEVICE KARA', 3, 2, 1, 2, '2024-10-20 13:53:37', '2024-10-20 13:53:37'),
(181, 19, 'Door', 39, 11, 1, 2, '2024-10-22 07:29:57', '2024-10-22 07:29:57'),
(182, 3, 'SWING DEVICE SHAFT', 3, 2, 1, 2, '2024-10-22 11:55:28', '2024-10-22 11:55:28'),
(183, 3, 'CHAIN BOLT', 11, 1, 1, 2, '2024-10-23 13:28:11', '2024-10-23 13:28:11'),
(184, 19, 'Seat Cover', 41, 11, 1, 2, '2024-10-25 10:26:45', '2024-10-25 10:26:45'),
(185, 19, 'Seat Cover', 41, 11, 1, 2, '2024-10-25 10:28:01', '2024-10-25 10:28:01'),
(186, 19, 'Back Light For Honda 125', 42, 11, 1, 2, '2024-10-25 10:41:42', '2024-10-25 10:41:42'),
(187, 19, 'Seat Cover Honda 125', 41, 11, 1, 2, '2024-10-25 10:44:42', '2024-10-25 10:44:42'),
(188, 19, 'Clutch Lever  Honda 125', 43, 11, 1, 2, '2024-10-25 10:47:14', '2024-10-25 10:47:14'),
(189, 19, 'Battery For Honda 125', 50, 11, 1, 2, '2024-10-25 10:50:13', '2024-10-25 10:50:13'),
(190, 19, 'Air Filter For Honda 125', 46, 11, 1, 2, '2024-10-25 10:52:16', '2024-10-25 10:52:16'),
(191, 19, 'Pressure Plate For Yamaha VBR 125G', 49, 11, 1, 2, '2024-10-25 11:00:21', '2024-10-25 11:00:21'),
(192, 19, 'Chain Kit For VBR 125G', 44, 11, 1, 2, '2024-10-25 11:02:33', '2024-10-25 11:02:33'),
(193, 19, 'Plug Cap for VBR 125G', 47, 11, 1, 2, '2024-10-25 11:04:36', '2024-10-25 11:04:36'),
(194, 19, 'TYRE For VBR 125G', 53, 11, 1, 2, '2024-10-25 11:09:33', '2024-10-25 11:09:33'),
(195, 19, 'GR 150 HEADLIGHT', 54, 11, 1, 2, '2024-10-25 11:18:04', '2024-10-25 11:18:04'),
(196, 19, 'GR150 COMPLETE SPEEDOMETER', 55, 11, 1, 2, '2024-10-25 11:37:30', '2024-10-25 11:37:30'),
(197, 19, 'GR 150 FRONT DISK PADS', 56, 11, 1, 2, '2024-10-25 11:40:47', '2024-10-25 11:40:47'),
(198, 19, 'Chain Kit For  RX3', 44, 11, 1, 2, '2024-10-25 11:54:26', '2024-10-25 11:54:26'),
(199, 19, 'Crown Brake Shoe Set with Spring for RX3', 58, 11, 1, 2, '2024-10-25 12:05:32', '2024-10-25 12:05:32'),
(200, 3, 'LEATHER PLATE', 3, 2, 1, 2, '2024-10-27 11:21:17', '2024-10-27 11:21:17'),
(201, 3, 'STEEL PLATE', 3, 2, 1, 2, '2024-10-27 11:22:46', '2024-10-27 11:22:46'),
(202, 3, 'SCREW BOLT', 3, 4, 1, 2, '2024-10-27 11:24:49', '2024-10-27 11:24:49'),
(203, 27, 'Pisiton ring', 60, 13, 2, 2, '2024-10-28 12:17:05', '2024-10-28 12:17:05'),
(204, 14, 'OWNER CAPITAL65', 61, 14, 1, 4, '2024-12-17 09:18:41', '2024-12-17 09:18:41');

-- --------------------------------------------------------

--
-- Table structure for table `machine_part_models`
--

CREATE TABLE `machine_part_models` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `machine_part_id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_part_models`
--

INSERT INTO `machine_part_models` (`id`, `user_id`, `name`, `machine_part_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 11, 'HAVAL', 171, 'WINDSHIELD', '2024-10-17 09:48:57', '2024-10-17 09:48:57'),
(2, 11, 'CD70', 176, NULL, '2024-10-18 05:37:43', '2024-10-18 05:37:43'),
(3, 19, 'Honda 125', 187, NULL, '2024-10-25 10:45:35', '2024-10-25 10:45:35');

-- --------------------------------------------------------

--
-- Table structure for table `machine_part_oem_dimensions`
--

CREATE TABLE `machine_part_oem_dimensions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `machine_part_oem_part_nos_machine_models_id` bigint(20) NOT NULL,
  `dimension_id` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_part_oem_dimensions`
--

INSERT INTO `machine_part_oem_dimensions` (`id`, `user_id`, `machine_part_oem_part_nos_machine_models_id`, `dimension_id`, `value`, `created_at`, `updated_at`) VALUES
(1, 6, 317, 2, 450, '2024-07-29 10:42:14', '2024-07-29 10:42:14'),
(2, 6, 317, 3, 200, '2024-07-29 10:42:14', '2024-07-29 10:42:14'),
(3, 6, 318, 5, 300, '2024-07-31 04:52:19', '2024-07-31 04:52:19'),
(4, 6, 319, 6, 200, '2024-07-31 07:59:52', '2024-07-31 07:59:52'),
(5, 6, 320, 6, 100, '2024-08-01 05:01:07', '2024-08-01 05:01:07'),
(6, 6, 333, 9, 100, '2024-08-06 06:27:36', '2024-08-06 06:27:36'),
(7, 6, 334, 9, 200, '2024-08-06 07:10:46', '2024-08-06 07:10:46'),
(8, 8, 367, 10, 10, '2024-08-22 10:46:21', '2024-08-22 10:46:21'),
(9, 8, 368, 10, 12, '2024-08-23 11:13:40', '2024-08-23 11:13:40'),
(10, NULL, 495, 11, 400, '2024-10-18 05:31:34', '2024-10-18 05:31:34'),
(11, NULL, 495, 12, 400, '2024-10-18 05:31:34', '2024-10-18 05:31:34'),
(12, 11, 496, 11, 100, '2024-10-18 05:48:12', '2024-10-18 05:48:12'),
(13, 11, 496, 12, 100, '2024-10-18 05:48:12', '2024-10-18 05:48:12'),
(14, 19, 497, 13, 100, '2024-10-18 09:28:53', '2024-10-18 09:28:53'),
(15, 19, 497, 14, 100, '2024-10-18 09:28:53', '2024-10-18 09:28:53'),
(16, 19, 498, 13, 100, '2024-10-18 11:23:10', '2024-10-18 11:23:10'),
(17, 19, 498, 14, 100, '2024-10-18 11:23:10', '2024-10-18 11:23:10'),
(18, 19, 505, 13, 100, '2024-10-21 03:56:15', '2024-10-21 03:56:15'),
(19, 19, 505, 14, 100, '2024-10-21 03:56:15', '2024-10-21 03:56:15'),
(20, 19, 506, 13, 100, '2024-10-21 06:04:11', '2024-10-21 06:04:11'),
(21, 19, 506, 14, 100, '2024-10-21 06:04:11', '2024-10-21 06:04:11'),
(22, 19, 509, 13, 1000, '2024-10-22 07:30:27', '2024-10-22 07:30:27'),
(23, 19, 509, 14, 1000, '2024-10-22 07:30:27', '2024-10-22 07:30:27'),
(24, 19, 515, 13, 100, '2024-10-25 10:29:52', '2024-10-25 10:29:52'),
(25, 19, 515, 14, 50, '2024-10-25 10:29:52', '2024-10-25 10:29:52');

-- --------------------------------------------------------

--
-- Table structure for table `machine_part_oem_part_model_company`
--

CREATE TABLE `machine_part_oem_part_model_company` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `number3` varchar(255) DEFAULT NULL,
  `machine_part_oem_part_nos_machine_models_id` int(10) UNSIGNED NOT NULL,
  `brands_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_part_oem_part_model_company`
--

INSERT INTO `machine_part_oem_part_model_company` (`id`, `user_id`, `number3`, `machine_part_oem_part_nos_machine_models_id`, `brands_id`, `created_at`, `updated_at`) VALUES
(1, NULL, 'L-1080', 317, 129, NULL, NULL),
(2, NULL, 'L 299', 318, 132, NULL, NULL),
(3, NULL, 'L450', 319, 134, NULL, NULL),
(4, NULL, 'C-1000', 320, 135, NULL, NULL),
(5, NULL, 'L450', 333, 139, NULL, NULL),
(6, NULL, 'C-1000', 334, 140, NULL, NULL),
(10, NULL, '8A3366E', 443, 109, NULL, NULL),
(11, NULL, 'LO70', 496, 159, NULL, NULL),
(12, NULL, 'IN70', 496, 158, NULL, NULL),
(13, NULL, NULL, 497, 163, NULL, NULL),
(14, NULL, NULL, 497, 164, NULL, NULL),
(15, NULL, 'CH11', 498, 163, NULL, NULL),
(16, NULL, 'JA11', 498, 162, NULL, NULL),
(17, NULL, 'JA300', 505, 162, NULL, NULL),
(18, NULL, 'LO400', 505, 164, NULL, NULL),
(19, NULL, 'LO70', 506, 164, NULL, NULL),
(20, NULL, 'CH11', 506, 163, NULL, NULL),
(21, NULL, 'LO70', 509, 164, NULL, NULL),
(22, NULL, 'l222', 515, 164, NULL, NULL),
(23, NULL, 'c666', 515, 163, NULL, NULL),
(24, NULL, 'C30', 522, 163, NULL, NULL),
(25, NULL, 'L03', 522, 164, NULL, NULL),
(26, NULL, 'L89', 523, 164, NULL, NULL),
(27, NULL, 'J001', 523, 162, NULL, NULL),
(28, NULL, 'J33', 526, 162, NULL, NULL),
(29, NULL, 'L98', 527, 164, NULL, NULL),
(30, NULL, 'C88', 528, 163, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `machine_part_oem_part_nos`
--

CREATE TABLE `machine_part_oem_part_nos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `machine_part_id` int(11) NOT NULL,
  `machine_part_model_id` int(11) DEFAULT NULL,
  `oem_part_no_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_part_oem_part_nos`
--

INSERT INTO `machine_part_oem_part_nos` (`id`, `user_id`, `machine_part_id`, `machine_part_model_id`, `oem_part_no_id`, `created_at`, `updated_at`) VALUES
(1, 3, 1, NULL, 1, '2024-07-09 08:44:34', '2024-07-09 08:44:34'),
(2, 3, 9, NULL, 2, '2024-07-09 09:21:17', '2024-07-09 09:21:17'),
(3, 3, 10, NULL, 3, '2024-07-09 09:24:55', '2024-07-09 09:24:55'),
(4, 3, 11, NULL, 4, '2024-07-09 09:27:21', '2024-07-09 09:27:21'),
(5, 3, 12, NULL, 5, '2024-07-09 09:57:41', '2024-07-09 09:57:41'),
(6, 3, 13, NULL, 6, '2024-07-09 09:59:57', '2024-07-09 09:59:57'),
(7, 3, 13, NULL, 7, '2024-07-09 10:01:19', '2024-07-09 10:01:19'),
(8, 3, 12, NULL, 8, '2024-07-09 10:02:10', '2024-07-09 10:02:10'),
(9, 3, 14, NULL, 9, '2024-07-09 10:45:57', '2024-07-09 10:45:57'),
(10, 3, 2, NULL, 10, '2024-07-10 07:42:59', '2024-07-10 07:42:59'),
(11, 3, 1, NULL, 11, '2024-07-10 07:43:58', '2024-07-10 07:43:58'),
(12, 3, 3, NULL, 12, '2024-07-10 07:44:31', '2024-07-10 07:44:31'),
(13, 3, 5, NULL, 13, '2024-07-10 07:45:11', '2024-07-10 07:45:11'),
(14, 3, 15, NULL, 14, '2024-07-10 07:52:12', '2024-07-10 07:52:12'),
(15, 3, 15, NULL, 15, '2024-07-10 07:53:11', '2024-07-10 07:53:11'),
(16, 3, 16, NULL, 16, '2024-07-10 07:58:55', '2024-07-10 07:58:55'),
(18, 3, 17, NULL, 18, '2024-07-10 08:01:16', '2024-07-10 08:01:16'),
(19, 3, 9, NULL, 19, '2024-07-10 08:07:45', '2024-07-10 08:07:45'),
(20, 3, 18, NULL, 20, '2024-07-10 10:54:00', '2024-07-10 10:54:00'),
(21, 3, 9, NULL, 21, '2024-07-10 10:54:37', '2024-07-10 10:54:37'),
(22, 3, 18, NULL, 22, '2024-07-10 10:55:13', '2024-07-10 10:55:13'),
(23, 3, 11, NULL, 23, '2024-07-10 11:03:03', '2024-07-10 11:03:03'),
(24, 3, 10, NULL, 24, '2024-07-10 11:04:54', '2024-07-10 11:04:54'),
(25, 3, 25, NULL, 25, '2024-07-10 11:47:29', '2024-07-10 11:47:29'),
(26, 3, 25, NULL, 26, '2024-07-10 11:50:21', '2024-07-10 11:50:21'),
(27, 3, 26, NULL, 27, '2024-07-10 12:03:29', '2024-07-10 12:03:29'),
(28, 3, 27, NULL, 28, '2024-07-10 12:18:31', '2024-07-10 12:18:31'),
(30, 3, 28, NULL, 30, '2024-07-10 12:33:06', '2024-07-10 12:33:06'),
(31, 3, 30, NULL, 31, '2024-07-10 12:34:51', '2024-07-10 12:34:51'),
(32, 3, 31, NULL, 32, '2024-07-10 12:36:18', '2024-07-10 12:36:18'),
(33, 3, 32, NULL, 33, '2024-07-10 12:37:30', '2024-07-10 12:37:30'),
(34, 3, 32, NULL, 34, '2024-07-10 12:39:09', '2024-07-10 12:39:09'),
(35, 3, 33, NULL, 35, '2024-07-10 12:42:58', '2024-07-10 12:42:58'),
(36, 3, 34, NULL, 36, '2024-07-10 12:44:54', '2024-07-10 12:44:54'),
(37, 3, 35, NULL, 37, '2024-07-10 13:51:36', '2024-07-10 13:51:36'),
(38, 3, 36, NULL, 38, '2024-07-10 14:00:34', '2024-07-10 14:00:34'),
(39, 3, 37, NULL, 39, '2024-07-10 14:09:00', '2024-07-10 14:09:00'),
(40, 3, 38, NULL, 40, '2024-07-10 14:30:04', '2024-07-10 14:30:04'),
(41, 3, 39, NULL, 41, '2024-07-10 14:32:29', '2024-07-10 14:32:29'),
(42, 3, 16, NULL, 42, '2024-07-10 14:33:29', '2024-07-10 14:33:29'),
(43, 3, 36, NULL, 43, '2024-07-12 02:17:11', '2024-07-12 02:17:11'),
(44, 3, 36, NULL, 44, '2024-07-12 02:18:49', '2024-07-12 02:18:49'),
(45, 3, 36, NULL, 45, '2024-07-12 02:19:32', '2024-07-12 02:19:32'),
(46, 3, 25, NULL, 46, '2024-07-12 02:27:48', '2024-07-12 02:27:48'),
(47, 3, 25, NULL, 47, '2024-07-12 02:29:15', '2024-07-12 02:29:15'),
(48, 3, 26, NULL, 48, '2024-07-12 02:30:54', '2024-07-12 02:30:54'),
(49, 3, 26, NULL, 49, '2024-07-12 02:31:50', '2024-07-12 02:31:50'),
(50, 3, 40, NULL, 50, '2024-07-12 02:34:34', '2024-07-12 02:34:34'),
(51, 3, 41, NULL, 51, '2024-07-12 02:59:29', '2024-07-12 02:59:29'),
(52, 3, 42, NULL, 52, '2024-07-12 03:00:05', '2024-07-12 03:00:05'),
(53, 3, 43, NULL, 53, '2024-07-12 03:02:31', '2024-07-12 03:02:31'),
(54, 3, 44, NULL, 54, '2024-07-12 03:03:20', '2024-07-12 03:03:20'),
(55, 3, 45, NULL, 55, '2024-07-12 03:04:56', '2024-07-12 03:04:56'),
(56, 3, 43, NULL, 56, '2024-07-12 03:31:23', '2024-07-12 03:31:23'),
(57, 3, 44, NULL, 57, '2024-07-12 03:32:08', '2024-07-12 03:32:08'),
(58, 3, 46, NULL, 58, '2024-07-12 03:47:23', '2024-07-12 03:47:23'),
(59, 3, 12, NULL, 59, '2024-07-12 03:51:43', '2024-07-12 03:51:43'),
(60, 3, 47, NULL, 60, '2024-07-12 03:57:58', '2024-07-12 03:57:58'),
(61, 3, 47, NULL, 61, '2024-07-12 03:58:59', '2024-07-12 03:58:59'),
(62, 3, 47, NULL, 62, '2024-07-12 04:00:00', '2024-07-12 04:00:00'),
(63, 3, 46, NULL, 63, '2024-07-12 04:02:42', '2024-07-12 04:02:42'),
(64, 3, 46, NULL, 64, '2024-07-12 04:03:38', '2024-07-12 04:03:38'),
(65, 3, 48, NULL, 65, '2024-07-12 04:06:01', '2024-07-12 04:06:01'),
(66, 3, 48, NULL, 66, '2024-07-12 04:06:57', '2024-07-12 04:06:57'),
(67, 3, 46, NULL, 67, '2024-07-12 04:07:39', '2024-07-12 04:07:39'),
(68, 3, 49, NULL, 68, '2024-07-12 04:12:32', '2024-07-12 04:12:32'),
(69, 3, 49, NULL, 69, '2024-07-12 04:13:33', '2024-07-12 04:13:33'),
(70, 3, 49, NULL, 70, '2024-07-12 04:14:36', '2024-07-12 04:14:36'),
(71, 3, 49, NULL, 71, '2024-07-12 04:15:14', '2024-07-12 04:15:14'),
(72, 3, 36, NULL, 72, '2024-07-12 04:42:23', '2024-07-12 04:42:23'),
(73, 3, 36, NULL, 73, '2024-07-12 04:45:16', '2024-07-12 04:45:16'),
(74, 3, 50, NULL, 74, '2024-07-12 04:48:58', '2024-07-12 04:48:58'),
(75, 3, 51, NULL, 75, '2024-07-12 04:49:41', '2024-07-12 04:49:41'),
(76, 3, 52, NULL, 76, '2024-07-12 04:50:14', '2024-07-12 04:50:14'),
(77, 3, 52, NULL, 77, '2024-07-12 04:52:04', '2024-07-12 04:52:04'),
(78, 3, 52, NULL, 78, '2024-07-12 04:53:44', '2024-07-12 04:53:44'),
(79, 3, 53, NULL, 79, '2024-07-12 08:01:29', '2024-07-12 08:01:29'),
(80, 3, 53, NULL, 80, '2024-07-12 08:02:21', '2024-07-12 08:02:21'),
(81, 3, 53, NULL, 81, '2024-07-12 08:03:25', '2024-07-12 08:03:25'),
(82, 3, 53, NULL, 82, '2024-07-12 08:04:07', '2024-07-12 08:04:07'),
(83, 3, 54, NULL, 83, '2024-07-12 08:05:25', '2024-07-12 08:05:25'),
(84, 3, 54, NULL, 84, '2024-07-12 08:05:56', '2024-07-12 08:05:56'),
(85, 3, 36, NULL, 85, '2024-07-12 08:06:55', '2024-07-12 08:06:55'),
(86, 3, 36, NULL, 86, '2024-07-12 08:08:01', '2024-07-12 08:08:01'),
(87, 3, 36, NULL, 87, '2024-07-12 08:08:25', '2024-07-12 08:08:25'),
(88, 3, 55, NULL, 88, '2024-07-12 08:11:13', '2024-07-12 08:11:13'),
(89, 3, 56, NULL, 89, '2024-07-12 08:12:30', '2024-07-12 08:12:30'),
(90, 3, 57, NULL, 90, '2024-07-12 08:26:53', '2024-07-12 08:26:53'),
(91, 3, 66, NULL, 91, '2024-07-12 13:00:47', '2024-07-12 13:00:47'),
(92, 3, 58, NULL, 92, '2024-07-12 13:07:11', '2024-07-12 13:07:11'),
(93, 3, 8, NULL, 93, '2024-07-12 13:09:12', '2024-07-12 13:09:12'),
(94, 3, 59, NULL, 94, '2024-07-12 13:10:23', '2024-07-12 13:10:23'),
(95, 3, 60, NULL, 95, '2024-07-12 13:12:04', '2024-07-12 13:12:04'),
(96, 3, 61, NULL, 96, '2024-07-12 13:16:06', '2024-07-12 13:16:06'),
(97, 3, 62, NULL, 97, '2024-07-12 13:17:31', '2024-07-12 13:17:31'),
(98, 3, 62, NULL, 98, '2024-07-12 13:18:39', '2024-07-12 13:18:39'),
(99, 3, 62, NULL, 99, '2024-07-12 13:21:18', '2024-07-12 13:21:18'),
(100, 3, 65, NULL, 100, '2024-07-12 13:22:18', '2024-07-12 13:22:18'),
(101, 3, 8, NULL, 101, '2024-07-12 13:23:40', '2024-07-12 13:23:40'),
(102, 3, 63, NULL, 102, '2024-07-12 13:24:58', '2024-07-12 13:24:58'),
(103, 3, 64, NULL, 103, '2024-07-12 13:26:13', '2024-07-12 13:26:13'),
(104, 3, 63, NULL, 104, '2024-07-13 04:32:36', '2024-07-13 04:32:36'),
(105, 3, 62, NULL, 105, '2024-07-13 04:34:35', '2024-07-13 04:34:35'),
(106, 3, 62, NULL, 106, '2024-07-13 04:35:13', '2024-07-13 04:35:13'),
(107, 3, 67, NULL, 107, '2024-07-13 04:39:55', '2024-07-13 04:39:55'),
(108, 3, 63, NULL, 108, '2024-07-13 04:41:18', '2024-07-13 04:41:18'),
(109, 3, 68, NULL, 109, '2024-07-13 04:42:48', '2024-07-13 04:42:48'),
(110, 3, 69, NULL, 110, '2024-07-13 04:45:32', '2024-07-13 04:45:32'),
(111, 3, 70, NULL, 111, '2024-07-13 06:13:12', '2024-07-13 06:13:12'),
(112, 3, 72, NULL, 112, '2024-07-13 06:15:31', '2024-07-13 06:15:31'),
(113, 3, 72, NULL, 113, '2024-07-13 06:17:16', '2024-07-13 06:17:16'),
(114, 3, 74, NULL, 114, '2024-07-13 06:19:21', '2024-07-13 06:19:21'),
(115, 3, 75, NULL, 115, '2024-07-13 06:20:33', '2024-07-13 06:20:33'),
(116, 3, 71, NULL, 116, '2024-07-13 06:24:51', '2024-07-13 06:24:51'),
(117, 3, 73, NULL, 117, '2024-07-13 06:32:29', '2024-07-13 06:32:29'),
(118, 3, 73, NULL, 118, '2024-07-13 06:48:42', '2024-07-13 06:48:42'),
(119, 3, 74, NULL, 119, '2024-07-13 06:49:24', '2024-07-13 06:49:24'),
(120, 3, 76, NULL, 120, '2024-07-13 06:49:57', '2024-07-13 06:49:57'),
(121, 3, 5, NULL, 121, '2024-07-13 06:52:14', '2024-07-13 06:52:14'),
(122, 3, 5, NULL, 122, '2024-07-13 06:52:48', '2024-07-13 06:52:48'),
(123, 3, 72, NULL, 123, '2024-07-13 06:53:47', '2024-07-13 06:53:47'),
(124, 3, 72, NULL, 124, '2024-07-13 06:54:53', '2024-07-13 06:54:53'),
(125, 3, 64, NULL, 125, '2024-07-13 06:56:33', '2024-07-13 06:56:33'),
(126, 3, 15, NULL, 126, '2024-07-13 06:58:04', '2024-07-13 06:58:04'),
(127, 3, 15, NULL, 127, '2024-07-13 06:58:45', '2024-07-13 06:58:45'),
(128, 3, 77, NULL, 128, '2024-07-13 07:01:58', '2024-07-13 07:01:58'),
(129, 3, 77, NULL, 129, '2024-07-13 07:02:38', '2024-07-13 07:02:38'),
(130, 3, 78, NULL, 130, '2024-07-13 07:38:00', '2024-07-13 07:38:00'),
(131, 3, 68, NULL, 131, '2024-07-13 07:40:01', '2024-07-13 07:40:01'),
(132, 3, 73, NULL, 132, '2024-07-13 07:43:04', '2024-07-13 07:43:04'),
(133, 3, 2, NULL, 133, '2024-07-13 07:44:09', '2024-07-13 07:44:09'),
(134, 3, 1, NULL, 134, '2024-07-13 07:44:57', '2024-07-13 07:44:57'),
(135, 3, 76, NULL, 135, '2024-07-13 08:05:54', '2024-07-13 08:05:54'),
(136, 3, 45, NULL, 136, '2024-07-13 08:15:33', '2024-07-13 08:15:33'),
(137, 3, 3, NULL, 137, '2024-07-13 10:19:06', '2024-07-13 10:19:06'),
(138, 3, 2, NULL, 138, '2024-07-13 10:23:55', '2024-07-13 10:23:55'),
(139, 3, 1, NULL, 139, '2024-07-13 10:50:35', '2024-07-13 10:50:35'),
(140, 3, 3, NULL, 140, '2024-07-13 11:08:00', '2024-07-13 11:08:00'),
(141, 3, 68, NULL, 141, '2024-07-13 11:09:48', '2024-07-13 11:09:48'),
(142, 3, 2, NULL, 142, '2024-07-13 11:10:37', '2024-07-13 11:10:37'),
(143, 3, 1, NULL, 143, '2024-07-13 11:11:08', '2024-07-13 11:11:08'),
(144, 3, 3, NULL, 144, '2024-07-13 11:11:43', '2024-07-13 11:11:43'),
(145, 3, 2, NULL, 145, '2024-07-13 11:15:27', '2024-07-13 11:15:27'),
(146, 3, 1, NULL, 146, '2024-07-13 11:17:13', '2024-07-13 11:17:13'),
(147, 3, 3, NULL, 147, '2024-07-13 11:17:50', '2024-07-13 11:17:50'),
(148, 3, 2, NULL, 148, '2024-07-13 11:19:38', '2024-07-13 11:19:38'),
(149, 3, 1, NULL, 149, '2024-07-13 11:20:16', '2024-07-13 11:20:16'),
(150, 3, 3, NULL, 150, '2024-07-13 11:21:38', '2024-07-13 11:21:38'),
(151, 3, 1, NULL, 151, '2024-07-13 11:24:24', '2024-07-13 11:24:24'),
(152, 3, 3, NULL, 152, '2024-07-13 11:26:05', '2024-07-13 11:26:05'),
(153, 3, 4, NULL, 153, '2024-07-13 11:27:42', '2024-07-13 11:27:42'),
(154, 3, 2, NULL, 154, '2024-07-13 12:35:06', '2024-07-13 12:35:06'),
(155, 3, 1, NULL, 155, '2024-07-13 12:35:50', '2024-07-13 12:35:50'),
(156, 3, 3, NULL, 156, '2024-07-13 12:36:31', '2024-07-13 12:36:31'),
(157, 3, 2, NULL, 157, '2024-07-13 12:38:17', '2024-07-13 12:38:17'),
(158, 3, 2, NULL, 158, '2024-07-13 12:38:40', '2024-07-13 12:38:40'),
(159, 3, 79, NULL, 159, '2024-07-13 13:06:29', '2024-07-13 13:06:29'),
(160, 3, 79, NULL, 160, '2024-07-13 13:07:25', '2024-07-13 13:07:25'),
(161, 3, 5, NULL, 161, '2024-07-13 13:09:04', '2024-07-13 13:09:04'),
(162, 3, 80, NULL, 162, '2024-07-13 13:10:42', '2024-07-13 13:10:42'),
(163, 3, 80, NULL, 163, '2024-07-13 13:11:36', '2024-07-13 13:11:36'),
(164, 3, 81, NULL, 164, '2024-07-13 13:16:34', '2024-07-13 13:16:34'),
(165, 3, 81, NULL, 165, '2024-07-13 13:18:11', '2024-07-13 13:18:11'),
(166, 3, 69, NULL, 166, '2024-07-13 13:19:27', '2024-07-13 13:19:27'),
(167, 3, 82, NULL, 167, '2024-07-13 13:23:33', '2024-07-13 13:23:33'),
(168, 3, 83, NULL, 168, '2024-07-13 13:27:46', '2024-07-13 13:27:46'),
(169, 3, 15, NULL, 169, '2024-07-14 05:00:08', '2024-07-14 05:00:08'),
(170, 3, 80, NULL, 170, '2024-07-14 05:01:12', '2024-07-14 05:01:12'),
(171, 3, 15, NULL, 171, '2024-07-14 05:04:30', '2024-07-14 05:04:30'),
(172, 3, 15, NULL, 172, '2024-07-14 05:05:12', '2024-07-14 05:05:12'),
(173, 3, 15, NULL, 173, '2024-07-14 05:06:14', '2024-07-14 05:06:14'),
(174, 3, 15, NULL, 174, '2024-07-14 05:06:50', '2024-07-14 05:06:50'),
(175, 3, 83, NULL, 175, '2024-07-14 05:09:00', '2024-07-14 05:09:00'),
(176, 3, 84, NULL, 176, '2024-07-14 05:12:42', '2024-07-14 05:12:42'),
(177, 3, 85, NULL, 177, '2024-07-14 05:13:31', '2024-07-14 05:13:31'),
(178, 3, 68, NULL, 178, '2024-07-14 05:39:47', '2024-07-14 05:39:47'),
(179, 3, 86, NULL, 179, '2024-07-14 05:43:57', '2024-07-14 05:43:57'),
(180, 3, 86, NULL, 180, '2024-07-14 05:44:50', '2024-07-14 05:44:50'),
(181, 3, 87, NULL, 181, '2024-07-14 05:48:17', '2024-07-14 05:48:17'),
(182, 3, 22, NULL, 182, '2024-07-14 06:14:56', '2024-07-14 06:14:56'),
(183, 3, 79, NULL, 183, '2024-07-14 07:44:31', '2024-07-14 07:44:31'),
(184, 3, 13, NULL, 184, '2024-07-14 07:47:51', '2024-07-14 07:47:51'),
(185, 3, 88, NULL, 185, '2024-07-14 08:04:22', '2024-07-14 08:04:22'),
(186, 3, 89, NULL, 186, '2024-07-14 08:06:34', '2024-07-14 08:06:34'),
(187, 3, 89, NULL, 187, '2024-07-14 08:07:04', '2024-07-14 08:07:04'),
(188, 3, 90, NULL, 188, '2024-07-14 08:09:35', '2024-07-14 08:09:35'),
(189, 3, 91, NULL, 189, '2024-07-14 08:13:19', '2024-07-14 08:13:19'),
(190, 3, 91, NULL, 190, '2024-07-14 08:13:57', '2024-07-14 08:13:57'),
(191, 3, 92, NULL, 191, '2024-07-14 08:15:19', '2024-07-14 08:15:19'),
(192, 3, 56, NULL, 192, '2024-07-14 08:16:03', '2024-07-14 08:16:03'),
(193, 3, 41, NULL, 193, '2024-07-14 08:17:15', '2024-07-14 08:17:15'),
(194, 3, 93, NULL, 194, '2024-07-14 08:27:57', '2024-07-14 08:27:57'),
(195, 3, 26, NULL, 195, '2024-07-14 08:30:15', '2024-07-14 08:30:15'),
(196, 3, 42, NULL, 196, '2024-07-14 08:31:49', '2024-07-14 08:31:49'),
(197, 3, 41, NULL, 197, '2024-07-14 08:32:40', '2024-07-14 08:32:40'),
(198, 3, 42, NULL, 198, '2024-07-14 08:34:34', '2024-07-14 08:34:34'),
(199, 3, 41, NULL, 199, '2024-07-14 08:36:07', '2024-07-14 08:36:07'),
(200, 3, 43, NULL, 200, '2024-07-14 08:37:34', '2024-07-14 08:37:34'),
(201, 3, 42, NULL, 201, '2024-07-14 08:38:58', '2024-07-14 08:38:58'),
(202, 3, 41, NULL, 202, '2024-07-14 08:39:31', '2024-07-14 08:39:31'),
(203, 3, 45, NULL, 203, '2024-07-14 08:40:43', '2024-07-14 08:40:43'),
(204, 3, 26, NULL, 204, '2024-07-14 08:41:22', '2024-07-14 08:41:22'),
(205, 3, 45, NULL, 205, '2024-07-14 08:42:06', '2024-07-14 08:42:06'),
(206, 3, 94, NULL, 206, '2024-07-14 08:44:42', '2024-07-14 08:44:42'),
(207, 3, 13, NULL, 207, '2024-07-14 09:57:46', '2024-07-14 09:57:46'),
(208, 3, 13, NULL, 208, '2024-07-14 09:58:35', '2024-07-14 09:58:35'),
(209, 3, 74, NULL, 209, '2024-07-14 09:59:55', '2024-07-14 09:59:55'),
(210, 3, 74, NULL, 210, '2024-07-14 10:00:54', '2024-07-14 10:00:54'),
(211, 3, 74, NULL, 211, '2024-07-14 10:01:47', '2024-07-14 10:01:47'),
(212, 3, 13, NULL, 212, '2024-07-14 10:02:27', '2024-07-14 10:02:27'),
(213, 3, 26, NULL, 213, '2024-07-14 10:03:32', '2024-07-14 10:03:32'),
(214, 3, 43, NULL, 214, '2024-07-14 10:04:31', '2024-07-14 10:04:31'),
(215, 3, 44, NULL, 215, '2024-07-14 10:05:24', '2024-07-14 10:05:24'),
(216, 3, 86, NULL, 216, '2024-07-14 10:09:40', '2024-07-14 10:09:40'),
(217, 3, 95, NULL, 217, '2024-07-14 10:11:31', '2024-07-14 10:11:31'),
(218, 3, 86, NULL, 218, '2024-07-14 10:12:53', '2024-07-14 10:12:53'),
(219, 3, 95, NULL, 219, '2024-07-14 10:14:08', '2024-07-14 10:14:08'),
(220, 3, 78, NULL, 220, '2024-07-14 10:15:37', '2024-07-14 10:15:37'),
(221, 3, 81, NULL, 221, '2024-07-15 16:44:46', '2024-07-15 16:44:46'),
(222, 3, 81, NULL, 222, '2024-07-15 16:45:13', '2024-07-15 16:45:13'),
(223, 3, 26, NULL, 223, '2024-07-15 17:17:05', '2024-07-15 17:17:05'),
(224, 3, 49, NULL, 224, '2024-07-15 17:33:44', '2024-07-15 17:33:44'),
(225, 3, 96, NULL, 225, '2024-07-15 17:35:23', '2024-07-15 17:35:23'),
(226, 3, 6, NULL, 226, '2024-07-16 10:29:50', '2024-07-16 10:29:50'),
(227, 3, 7, NULL, 227, '2024-07-16 10:42:59', '2024-07-16 10:42:59'),
(228, 3, 97, NULL, 228, '2024-07-16 10:44:11', '2024-07-16 10:44:11'),
(229, 3, 97, NULL, 229, '2024-07-16 10:44:53', '2024-07-16 10:44:53'),
(230, 3, 37, NULL, 230, '2024-07-16 10:45:58', '2024-07-16 10:45:58'),
(231, 3, 37, NULL, 231, '2024-07-16 10:46:21', '2024-07-16 10:46:21'),
(232, 3, 13, NULL, 232, '2024-07-16 10:47:01', '2024-07-16 10:47:01'),
(233, 3, 36, NULL, 233, '2024-07-16 10:49:03', '2024-07-16 10:49:03'),
(234, 3, 36, NULL, 234, '2024-07-16 10:49:40', '2024-07-16 10:49:40'),
(235, 3, 36, NULL, 235, '2024-07-16 10:52:27', '2024-07-16 10:52:27'),
(236, 3, 36, NULL, 236, '2024-07-16 10:52:55', '2024-07-16 10:52:55'),
(237, 3, 2, NULL, 237, '2024-07-16 10:56:38', '2024-07-16 10:56:38'),
(238, 3, 1, NULL, 238, '2024-07-16 10:56:59', '2024-07-16 10:56:59'),
(239, 3, 3, NULL, 239, '2024-07-16 10:57:23', '2024-07-16 10:57:23'),
(240, 3, 37, NULL, 240, '2024-07-16 12:34:13', '2024-07-16 12:34:13'),
(241, 3, 15, NULL, 241, '2024-07-16 12:47:42', '2024-07-16 12:47:42'),
(242, 3, 7, NULL, 242, '2024-07-16 13:14:43', '2024-07-16 13:14:43'),
(243, 3, 49, NULL, 243, '2024-07-16 13:15:38', '2024-07-16 13:15:38'),
(244, 3, 7, NULL, 244, '2024-07-16 13:17:17', '2024-07-16 13:17:17'),
(245, 3, 83, NULL, 245, '2024-07-17 08:47:10', '2024-07-17 08:47:10'),
(246, 3, 98, NULL, 246, '2024-07-17 08:54:51', '2024-07-17 08:54:51'),
(247, 3, 99, NULL, 247, '2024-07-17 09:01:41', '2024-07-17 09:01:41'),
(248, 3, 100, NULL, 248, '2024-07-17 09:02:51', '2024-07-17 09:02:51'),
(249, 3, 7, NULL, 249, '2024-07-17 09:08:16', '2024-07-17 09:08:16'),
(250, 3, 26, NULL, 250, '2024-07-17 09:10:12', '2024-07-17 09:10:12'),
(251, 3, 99, NULL, 251, '2024-07-17 09:11:26', '2024-07-17 09:11:26'),
(252, 3, 99, NULL, 252, '2024-07-18 10:51:50', '2024-07-18 10:51:50'),
(253, 3, 101, NULL, 253, '2024-07-18 10:58:09', '2024-07-18 10:58:09'),
(254, 3, 103, NULL, 254, '2024-07-18 10:58:46', '2024-07-18 10:58:46'),
(255, 3, 104, NULL, 255, '2024-07-18 10:59:34', '2024-07-18 10:59:34'),
(256, 3, 102, NULL, 256, '2024-07-18 11:00:04', '2024-07-18 11:00:04'),
(257, 3, 12, NULL, 257, '2024-07-18 11:30:01', '2024-07-18 11:30:01'),
(258, 3, 2, NULL, 258, '2024-07-18 11:42:36', '2024-07-18 11:42:36'),
(259, 3, 1, NULL, 259, '2024-07-18 11:43:14', '2024-07-18 11:43:14'),
(260, 3, 3, NULL, 260, '2024-07-18 11:44:02', '2024-07-18 11:44:02'),
(261, 3, 105, NULL, 261, '2024-07-18 11:45:56', '2024-07-18 11:45:56'),
(262, 3, 77, NULL, 262, '2024-07-18 11:56:51', '2024-07-18 11:56:51'),
(263, 3, 106, NULL, 263, '2024-07-20 09:37:19', '2024-07-20 09:37:19'),
(264, 3, 106, NULL, 264, '2024-07-20 09:37:44', '2024-07-20 09:37:44'),
(265, 3, 101, NULL, 265, '2024-07-20 09:47:38', '2024-07-20 09:47:38'),
(266, 3, 107, NULL, 266, '2024-07-20 10:02:59', '2024-07-20 10:02:59'),
(267, 3, 107, NULL, 267, '2024-07-20 10:03:49', '2024-07-20 10:03:49'),
(268, 3, 7, NULL, 268, '2024-07-20 10:16:15', '2024-07-20 10:16:15'),
(269, 3, 49, NULL, 269, '2024-07-20 10:16:46', '2024-07-20 10:16:46'),
(270, 3, 108, NULL, 270, '2024-07-20 10:21:23', '2024-07-20 10:21:23'),
(271, 3, 2, NULL, 271, '2024-07-20 10:27:38', '2024-07-20 10:27:38'),
(272, 3, 1, NULL, 272, '2024-07-20 10:28:50', '2024-07-20 10:28:50'),
(273, 3, 3, NULL, 273, '2024-07-20 10:29:16', '2024-07-20 10:29:16'),
(274, 3, 108, NULL, 274, '2024-07-20 10:45:19', '2024-07-20 10:45:19'),
(275, 3, 109, NULL, 275, '2024-07-20 10:45:57', '2024-07-20 10:45:57'),
(276, 3, 4, NULL, 276, '2024-07-20 10:55:22', '2024-07-20 10:55:22'),
(277, 3, 72, NULL, 277, '2024-07-20 10:55:51', '2024-07-20 10:55:51'),
(278, 3, 68, NULL, 278, '2024-07-20 10:56:15', '2024-07-20 10:56:15'),
(279, 3, 72, NULL, 279, '2024-07-20 10:56:38', '2024-07-20 10:56:38'),
(280, 3, 15, NULL, 280, '2024-07-20 11:02:35', '2024-07-20 11:02:35'),
(281, 3, 15, NULL, 281, '2024-07-20 11:03:28', '2024-07-20 11:03:28'),
(282, 3, 68, NULL, 282, '2024-07-20 11:12:39', '2024-07-20 11:12:39'),
(283, 3, 2, NULL, 283, '2024-07-20 11:13:23', '2024-07-20 11:13:23'),
(284, 3, 1, NULL, 284, '2024-07-20 11:13:51', '2024-07-20 11:13:51'),
(285, 3, 2, NULL, 285, '2024-07-20 11:23:18', '2024-07-20 11:23:18'),
(286, 3, 106, NULL, 286, '2024-07-20 11:24:56', '2024-07-20 11:24:56'),
(287, 3, 106, NULL, 287, '2024-07-20 11:25:31', '2024-07-20 11:25:31'),
(288, 3, 110, NULL, 288, '2024-07-20 11:45:05', '2024-07-20 11:45:05'),
(289, 3, 49, NULL, 289, '2024-07-20 11:52:35', '2024-07-20 11:52:35'),
(290, 3, 51, NULL, 290, '2024-07-20 11:59:17', '2024-07-20 11:59:17'),
(291, 3, 49, NULL, 291, '2024-07-20 12:03:42', '2024-07-20 12:03:42'),
(292, 3, 111, NULL, 292, '2024-07-20 12:53:34', '2024-07-20 12:53:34'),
(293, 3, 113, NULL, 293, '2024-07-20 12:58:38', '2024-07-20 12:58:38'),
(294, 3, 112, NULL, 294, '2024-07-20 13:08:30', '2024-07-20 13:08:30'),
(295, 3, 26, NULL, 295, '2024-07-20 13:19:13', '2024-07-20 13:19:13'),
(296, 3, 42, NULL, 296, '2024-07-20 13:20:18', '2024-07-20 13:20:18'),
(297, 3, 41, NULL, 297, '2024-07-20 13:21:27', '2024-07-20 13:21:27'),
(298, 3, 115, NULL, 298, '2024-07-20 13:26:37', '2024-07-20 13:26:37'),
(299, 3, 116, NULL, 299, '2024-07-22 11:02:17', '2024-07-22 11:02:17'),
(300, 3, 116, NULL, 300, '2024-07-22 11:03:02', '2024-07-22 11:03:02'),
(301, 3, 116, NULL, 301, '2024-07-22 11:03:38', '2024-07-22 11:03:38'),
(302, 3, 117, NULL, 302, '2024-07-22 11:07:29', '2024-07-22 11:07:29'),
(303, 3, 118, NULL, 303, '2024-07-22 11:08:35', '2024-07-22 11:08:35'),
(304, 3, 93, NULL, 304, '2024-07-22 11:11:23', '2024-07-22 11:11:23'),
(305, 3, 19, NULL, 305, '2024-07-22 11:12:12', '2024-07-22 11:12:12'),
(306, 3, 10, NULL, 306, '2024-07-22 11:15:25', '2024-07-22 11:15:25'),
(307, 3, 15, NULL, 307, '2024-07-22 13:30:23', '2024-07-22 13:30:23'),
(308, 3, 119, NULL, 308, '2024-07-22 13:31:28', '2024-07-22 13:31:28'),
(309, 3, 115, NULL, 309, '2024-07-25 13:40:41', '2024-07-25 13:40:41'),
(310, 3, 49, NULL, 310, '2024-07-27 07:58:32', '2024-07-27 07:58:32'),
(311, 3, 49, NULL, 311, '2024-07-27 07:59:15', '2024-07-27 07:59:15'),
(312, 3, 120, NULL, 312, '2024-07-27 08:00:33', '2024-07-27 08:00:33'),
(313, 3, 26, NULL, 313, '2024-07-28 13:34:14', '2024-07-28 13:34:14'),
(314, 3, 105, NULL, 314, '2024-07-28 13:34:49', '2024-07-28 13:34:49'),
(315, 3, 12, NULL, 315, '2024-07-28 13:35:41', '2024-07-28 13:35:41'),
(316, 3, 105, NULL, 316, '2024-07-28 13:37:07', '2024-07-28 13:37:07'),
(321, 3, 66, NULL, 321, '2024-08-03 09:17:36', '2024-08-03 09:17:36'),
(322, 3, 1, NULL, 322, '2024-08-03 09:39:16', '2024-08-03 09:39:16'),
(323, 3, 1, NULL, 323, '2024-08-03 09:40:22', '2024-08-03 09:40:22'),
(324, 3, 18, NULL, 324, '2024-08-03 09:41:03', '2024-08-03 09:41:03'),
(325, 3, 2, NULL, 325, '2024-08-05 07:02:35', '2024-08-05 07:02:35'),
(326, 3, 1, NULL, 326, '2024-08-05 07:03:01', '2024-08-05 07:03:01'),
(327, 3, 3, NULL, 327, '2024-08-05 07:03:37', '2024-08-05 07:03:37'),
(328, 3, 13, NULL, 328, '2024-08-05 07:04:27', '2024-08-05 07:04:27'),
(329, 3, 36, NULL, 329, '2024-08-05 07:05:02', '2024-08-05 07:05:02'),
(330, 3, 63, NULL, 330, '2024-08-05 07:16:04', '2024-08-05 07:16:04'),
(331, 3, 65, NULL, 331, '2024-08-05 09:33:11', '2024-08-05 09:33:11'),
(332, 3, 67, NULL, 332, '2024-08-05 09:35:08', '2024-08-05 09:35:08'),
(333, 6, 124, NULL, 333, '2024-08-06 06:27:36', '2024-08-06 06:27:36'),
(334, 6, 124, NULL, 334, '2024-08-06 07:10:46', '2024-08-06 07:10:46'),
(335, 3, 78, NULL, 335, '2024-08-07 05:08:40', '2024-08-07 05:08:40'),
(336, 3, 13, NULL, 336, '2024-08-07 05:09:35', '2024-08-07 05:09:35'),
(337, 3, 105, NULL, 337, '2024-08-07 05:10:16', '2024-08-07 05:10:16'),
(338, 3, 105, NULL, 338, '2024-08-07 05:10:49', '2024-08-07 05:10:49'),
(339, 3, 12, NULL, 339, '2024-08-07 06:17:10', '2024-08-07 06:17:10'),
(340, 3, 36, NULL, 340, '2024-08-07 06:18:00', '2024-08-07 06:18:00'),
(341, 3, 126, NULL, 341, '2024-08-07 06:37:18', '2024-08-07 06:37:18'),
(342, 3, 127, NULL, 342, '2024-08-07 09:45:37', '2024-08-07 09:45:37'),
(343, 3, 128, NULL, 343, '2024-08-07 09:46:17', '2024-08-07 09:46:17'),
(344, 3, 83, NULL, 344, '2024-08-07 09:46:56', '2024-08-07 09:46:56'),
(345, 3, 53, NULL, 345, '2024-08-07 09:55:27', '2024-08-07 09:55:27'),
(346, 3, 129, NULL, 346, '2024-08-07 10:36:27', '2024-08-07 10:36:27'),
(347, 3, 130, NULL, 347, '2024-08-07 10:44:19', '2024-08-07 10:44:19'),
(348, 3, 12, NULL, 348, '2024-08-07 12:38:04', '2024-08-07 12:38:04'),
(349, 3, 23, NULL, 349, '2024-08-07 12:39:34', '2024-08-07 12:39:34'),
(350, 3, 1, NULL, 350, '2024-08-07 12:44:27', '2024-08-07 12:44:27'),
(351, NULL, 189, NULL, 351, '2024-08-07 12:44:56', '2024-08-07 12:44:56'),
(352, 3, 10, NULL, 352, '2024-08-07 12:47:31', '2024-08-07 12:47:31'),
(353, 3, 18, NULL, 353, '2024-08-07 12:48:55', '2024-08-07 12:48:55'),
(354, 3, 131, NULL, 354, '2024-08-07 12:53:44', '2024-08-07 12:53:44'),
(355, 3, 132, NULL, 355, '2024-08-07 12:56:53', '2024-08-07 12:56:53'),
(356, 3, 133, NULL, 356, '2024-08-07 13:04:19', '2024-08-07 13:04:19'),
(357, 3, 17, NULL, 357, '2024-08-07 13:50:37', '2024-08-07 13:50:37'),
(358, 3, 10, NULL, 358, '2024-08-08 10:34:05', '2024-08-08 10:34:05'),
(359, 3, 24, NULL, 359, '2024-08-08 10:57:00', '2024-08-08 10:57:00'),
(360, 3, 135, NULL, 360, '2024-08-11 07:00:54', '2024-08-11 07:00:54'),
(361, 3, 136, NULL, 361, '2024-08-11 07:02:58', '2024-08-11 07:02:58'),
(362, 3, 1, NULL, 362, '2024-08-11 13:40:10', '2024-08-11 13:40:10'),
(363, 3, 49, NULL, 363, '2024-08-11 13:41:14', '2024-08-11 13:41:14'),
(364, 6, 137, NULL, 364, '2024-08-12 09:48:16', '2024-08-12 09:48:16'),
(365, 3, 18, NULL, 365, '2024-08-17 10:49:44', '2024-08-17 10:49:44'),
(366, 3, 13, NULL, 366, '2024-08-17 10:52:58', '2024-08-17 10:52:58'),
(367, 8, 138, NULL, 367, '2024-08-22 10:46:21', '2024-08-22 10:46:21'),
(368, 8, 138, NULL, 368, '2024-08-23 11:13:40', '2024-08-23 11:13:40'),
(369, 10, 139, NULL, 369, '2024-08-26 06:50:25', '2024-08-26 06:50:25'),
(370, 10, 139, NULL, 370, '2024-08-26 06:51:49', '2024-08-26 06:51:49'),
(371, 8, 138, NULL, 371, '2024-08-28 07:00:37', '2024-08-28 07:00:37'),
(372, 11, 141, NULL, 372, '2024-08-28 08:22:58', '2024-08-28 08:22:58'),
(373, 11, 141, NULL, 373, '2024-08-28 08:45:18', '2024-08-28 08:45:18'),
(374, 11, 141, NULL, 374, '2024-08-28 09:23:59', '2024-08-28 09:23:59'),
(375, 11, 141, NULL, 375, '2024-08-28 10:05:58', '2024-08-28 10:05:58'),
(376, 11, 141, NULL, 376, '2024-08-28 11:28:45', '2024-08-28 11:28:45'),
(377, 8, 140, NULL, 377, '2024-08-28 11:35:48', '2024-08-28 11:35:48'),
(378, 11, 141, NULL, 378, '2024-08-28 12:16:32', '2024-08-28 12:16:32'),
(379, 11, 141, NULL, 379, '2024-08-29 06:48:14', '2024-08-29 06:48:14'),
(380, 11, 141, NULL, 380, '2024-08-29 09:02:20', '2024-08-29 09:02:20'),
(381, 13, 142, NULL, 381, '2024-08-30 10:56:21', '2024-08-30 10:56:21'),
(382, 3, 109, NULL, 382, '2024-09-03 07:57:53', '2024-09-03 07:57:53'),
(383, 3, 109, NULL, 383, '2024-09-03 11:35:18', '2024-09-03 11:35:18'),
(384, 3, 13, NULL, 384, '2024-09-04 08:03:06', '2024-09-04 08:03:06'),
(385, 3, 63, NULL, 385, '2024-09-07 13:05:39', '2024-09-07 13:05:39'),
(386, 3, 63, NULL, 386, '2024-09-07 13:06:26', '2024-09-07 13:06:26'),
(387, 3, 68, NULL, 387, '2024-09-07 13:12:34', '2024-09-07 13:12:34'),
(388, 3, 63, NULL, 388, '2024-09-08 05:40:56', '2024-09-08 05:40:56'),
(389, 3, 143, NULL, 389, '2024-09-08 05:45:27', '2024-09-08 05:45:27'),
(390, 3, 72, NULL, 390, '2024-09-09 11:50:03', '2024-09-09 11:50:03'),
(391, 3, 68, NULL, 391, '2024-09-09 11:50:38', '2024-09-09 11:50:38'),
(392, 3, 6, NULL, 392, '2024-09-09 11:51:12', '2024-09-09 11:51:12'),
(393, 3, 3, NULL, 393, '2024-09-09 11:51:48', '2024-09-09 11:51:48'),
(394, 3, 49, NULL, 394, '2024-09-09 11:52:30', '2024-09-09 11:52:30'),
(395, 3, 144, NULL, 395, '2024-09-09 12:00:23', '2024-09-09 12:00:23'),
(396, 3, 145, NULL, 396, '2024-09-09 12:21:15', '2024-09-09 12:21:15'),
(397, 3, 18, NULL, 397, '2024-09-09 12:28:26', '2024-09-09 12:28:26'),
(399, 3, 93, NULL, 399, '2024-09-09 12:30:58', '2024-09-09 12:30:58'),
(400, 3, 10, NULL, 400, '2024-09-09 12:31:41', '2024-09-09 12:31:41'),
(401, 3, 19, NULL, 401, '2024-09-09 12:32:11', '2024-09-09 12:32:11'),
(402, 3, 146, NULL, 402, '2024-09-09 12:33:37', '2024-09-09 12:33:37'),
(403, 3, 16, NULL, 403, '2024-09-09 12:34:21', '2024-09-09 12:34:21'),
(404, 3, 147, NULL, 404, '2024-09-09 12:35:21', '2024-09-09 12:35:21'),
(405, 3, 22, NULL, 405, '2024-09-09 12:35:48', '2024-09-09 12:35:48'),
(406, 3, 148, NULL, 406, '2024-09-09 12:46:03', '2024-09-09 12:46:03'),
(407, 3, 149, NULL, 407, '2024-09-09 12:46:31', '2024-09-09 12:46:31'),
(408, 3, 11, NULL, 408, '2024-09-09 12:50:12', '2024-09-09 12:50:12'),
(409, 3, 108, NULL, 409, '2024-09-09 13:22:28', '2024-09-09 13:22:28'),
(410, 3, 109, NULL, 410, '2024-09-09 13:23:06', '2024-09-09 13:23:06'),
(411, 3, 150, NULL, 411, '2024-09-09 13:24:47', '2024-09-09 13:24:47'),
(412, 3, 26, NULL, 412, '2024-09-09 13:36:29', '2024-09-09 13:36:29'),
(413, 3, 42, NULL, 413, '2024-09-09 13:37:35', '2024-09-09 13:37:35'),
(414, 3, 151, NULL, 414, '2024-09-10 06:08:41', '2024-09-10 06:08:41'),
(415, 3, 8, NULL, 415, '2024-09-10 06:10:43', '2024-09-10 06:10:43'),
(416, 3, 152, NULL, 416, '2024-09-10 06:11:54', '2024-09-10 06:11:54'),
(417, 3, 1, NULL, 417, '2024-09-11 10:54:28', '2024-09-11 10:54:28'),
(418, 3, 43, NULL, 418, '2024-09-11 10:55:09', '2024-09-11 10:55:09'),
(419, 3, 80, NULL, 419, '2024-09-11 10:55:50', '2024-09-11 10:55:50'),
(420, 3, 80, NULL, 420, '2024-09-11 10:58:13', '2024-09-11 10:58:13'),
(421, 3, 153, NULL, 421, '2024-09-11 11:00:40', '2024-09-11 11:00:40'),
(422, 3, 156, NULL, 422, '2024-09-11 11:17:29', '2024-09-11 11:17:29'),
(423, 3, 78, NULL, 423, '2024-09-11 11:19:07', '2024-09-11 11:19:07'),
(424, 3, 155, NULL, 424, '2024-09-11 11:19:43', '2024-09-11 11:19:43'),
(425, 3, 87, NULL, 425, '2024-09-11 11:20:41', '2024-09-11 11:20:41'),
(426, 3, 18, NULL, 426, '2024-09-11 11:21:27', '2024-09-11 11:21:27'),
(427, 3, 157, NULL, 427, '2024-09-11 11:23:48', '2024-09-11 11:23:48'),
(428, 3, 158, NULL, 428, '2024-09-11 11:28:35', '2024-09-11 11:28:35'),
(429, 3, 12, NULL, 429, '2024-09-11 11:29:19', '2024-09-11 11:29:19'),
(430, 3, 83, NULL, 430, '2024-09-14 13:07:59', '2024-09-14 13:07:59'),
(431, 3, 159, NULL, 431, '2024-09-14 13:23:56', '2024-09-14 13:23:56'),
(432, 3, 53, NULL, 432, '2024-09-15 11:18:39', '2024-09-15 11:18:39'),
(433, 3, 89, NULL, 433, '2024-09-19 08:58:14', '2024-09-19 08:58:14'),
(434, 3, 9, NULL, 434, '2024-09-19 09:22:55', '2024-09-19 09:22:55'),
(435, 3, 17, NULL, 435, '2024-09-19 09:23:24', '2024-09-19 09:23:24'),
(436, 3, 13, NULL, 436, '2024-09-19 11:16:12', '2024-09-19 11:16:12'),
(437, 3, 13, NULL, 437, '2024-09-19 11:16:58', '2024-09-19 11:16:58'),
(438, 3, 9, NULL, 438, '2024-09-19 11:17:29', '2024-09-19 11:17:29'),
(439, 3, 37, NULL, 439, '2024-09-19 11:22:10', '2024-09-19 11:22:10'),
(440, 3, 160, NULL, 440, '2024-09-19 11:28:12', '2024-09-19 11:28:12'),
(441, 3, 15, NULL, 441, '2024-09-19 14:43:25', '2024-09-19 14:43:25'),
(442, 3, 36, NULL, 442, '2024-09-19 14:48:13', '2024-09-19 14:48:13'),
(443, 3, 9, NULL, 443, '2024-09-21 04:56:54', '2024-09-21 04:56:54'),
(444, 3, 9, NULL, 444, '2024-09-21 04:57:31', '2024-09-21 04:57:31'),
(445, 3, 12, NULL, 445, '2024-09-21 05:38:04', '2024-09-21 05:38:04'),
(446, 3, 18, NULL, 446, '2024-09-21 05:38:38', '2024-09-21 05:38:38'),
(447, 3, 18, NULL, 447, '2024-09-21 05:41:00', '2024-09-21 05:41:00'),
(448, 3, 42, NULL, 448, '2024-09-22 04:38:03', '2024-09-22 04:38:03'),
(449, 3, 83, NULL, 449, '2024-09-22 04:41:14', '2024-09-22 04:41:14'),
(450, 3, 81, NULL, 450, '2024-09-22 04:43:11', '2024-09-22 04:43:11'),
(451, 3, 161, NULL, 451, '2024-09-22 04:47:33', '2024-09-22 04:47:33'),
(452, 3, 162, NULL, 452, '2024-09-22 04:58:49', '2024-09-22 04:58:49'),
(453, 3, 163, NULL, 453, '2024-09-22 06:35:51', '2024-09-22 06:35:51'),
(454, 3, 8, NULL, 454, '2024-09-23 12:56:07', '2024-09-23 12:56:07'),
(455, 3, 3, NULL, 455, '2024-09-23 13:10:18', '2024-09-23 13:10:18'),
(456, 3, 48, NULL, 456, '2024-09-24 05:20:56', '2024-09-24 05:20:56'),
(457, 3, 48, NULL, 457, '2024-09-24 05:22:09', '2024-09-24 05:22:09'),
(458, 3, 164, NULL, 458, '2024-09-24 05:27:30', '2024-09-24 05:27:30'),
(459, 3, 105, NULL, 459, '2024-09-24 12:07:00', '2024-09-24 12:07:00'),
(460, 3, 7, NULL, 460, '2024-09-24 12:07:35', '2024-09-24 12:07:35'),
(461, 3, 49, NULL, 461, '2024-09-24 12:08:03', '2024-09-24 12:08:03'),
(462, 3, 3, NULL, 462, '2024-09-24 12:08:51', '2024-09-24 12:08:51'),
(463, 3, 38, NULL, 463, '2024-09-24 12:17:22', '2024-09-24 12:17:22'),
(464, 3, 133, NULL, 464, '2024-09-24 12:59:14', '2024-09-24 12:59:14'),
(465, 3, 49, NULL, 465, '2024-09-25 05:41:30', '2024-09-25 05:41:30'),
(466, 3, 7, NULL, 466, '2024-09-25 05:42:06', '2024-09-25 05:42:06'),
(467, 3, 46, NULL, 467, '2024-09-25 06:15:55', '2024-09-25 06:15:55'),
(468, 3, 163, NULL, 468, '2024-09-25 06:31:21', '2024-09-25 06:31:21'),
(469, 3, 81, NULL, 469, '2024-09-25 12:14:22', '2024-09-25 12:14:22'),
(470, 3, 15, NULL, 470, '2024-09-26 14:03:20', '2024-09-26 14:03:20'),
(471, 3, 40, NULL, 471, '2024-10-02 12:28:40', '2024-10-02 12:28:40'),
(472, 3, 42, NULL, 472, '2024-10-02 12:36:23', '2024-10-02 12:36:23'),
(473, 3, 165, NULL, 473, '2024-10-02 12:56:48', '2024-10-02 12:56:48'),
(474, 3, 160, NULL, 474, '2024-10-02 13:02:00', '2024-10-02 13:02:00'),
(475, 3, 18, NULL, 475, '2024-10-03 05:04:48', '2024-10-03 05:04:48'),
(476, 3, 12, NULL, 476, '2024-10-03 05:06:05', '2024-10-03 05:06:05'),
(477, 3, 17, NULL, 477, '2024-10-03 05:06:40', '2024-10-03 05:06:40'),
(478, 3, 105, NULL, 478, '2024-10-09 12:43:30', '2024-10-09 12:43:30'),
(479, 3, 78, NULL, 479, '2024-10-10 13:13:03', '2024-10-10 13:13:03'),
(480, 3, 75, NULL, 480, '2024-10-10 13:59:11', '2024-10-10 13:59:11'),
(481, 3, 46, NULL, 481, '2024-10-10 14:02:46', '2024-10-10 14:02:46'),
(482, 3, 76, NULL, 482, '2024-10-10 14:05:02', '2024-10-10 14:05:02'),
(483, 3, 106, NULL, 483, '2024-10-10 14:07:58', '2024-10-10 14:07:58'),
(484, 3, 106, NULL, 484, '2024-10-10 14:10:28', '2024-10-10 14:10:28'),
(485, 3, 80, NULL, 485, '2024-10-12 07:28:48', '2024-10-12 07:28:48'),
(486, 3, 53, NULL, 486, '2024-10-12 07:50:54', '2024-10-12 07:50:54'),
(487, 3, 44, NULL, 487, '2024-10-12 12:05:00', '2024-10-12 12:05:00'),
(488, 3, 159, NULL, 488, '2024-10-12 12:08:46', '2024-10-12 12:08:46'),
(489, 3, 52, NULL, 489, '2024-10-12 13:16:57', '2024-10-12 13:16:57'),
(490, 3, 115, NULL, 490, '2024-10-12 13:18:55', '2024-10-12 13:18:55'),
(491, 3, 166, NULL, 491, '2024-10-12 13:22:25', '2024-10-12 13:22:25'),
(492, 3, 167, NULL, 492, '2024-10-12 13:28:19', '2024-10-12 13:28:19'),
(493, 3, 168, NULL, 493, '2024-10-12 13:29:23', '2024-10-12 13:29:23'),
(494, 3, 161, NULL, 494, '2024-10-12 13:31:27', '2024-10-12 13:31:27'),
(495, 3, 166, NULL, 495, '2024-10-12 13:32:37', '2024-10-12 13:32:37'),
(496, 3, 106, NULL, 496, '2024-10-13 05:37:35', '2024-10-13 05:37:35'),
(497, 3, 136, NULL, 497, '2024-10-13 05:47:57', '2024-10-13 05:47:57'),
(498, 3, 169, NULL, 498, '2024-10-14 05:08:43', '2024-10-14 05:08:43'),
(499, 3, 45, NULL, 499, '2024-10-15 11:58:59', '2024-10-15 11:58:59'),
(500, 3, 106, NULL, 500, '2024-10-15 12:21:36', '2024-10-15 12:21:36'),
(501, 3, 166, NULL, 501, '2024-10-16 11:55:25', '2024-10-16 11:55:25'),
(502, 3, 166, NULL, 502, '2024-10-16 11:56:19', '2024-10-16 11:56:19'),
(503, 3, 166, NULL, 503, '2024-10-16 11:57:01', '2024-10-16 11:57:01'),
(508, 11, 171, NULL, 508, '2024-10-17 12:58:10', '2024-10-18 05:01:10'),
(509, 11, 141, 494, 509, '2024-10-17 12:58:53', '2024-10-18 05:05:22'),
(510, 11, 175, NULL, 510, '2024-10-18 05:25:16', '2024-10-18 05:25:16'),
(511, 11, 176, NULL, 511, '2024-10-18 05:48:12', '2024-10-18 05:48:12'),
(513, 19, 178, NULL, 513, '2024-10-18 11:23:10', '2024-10-18 11:23:10'),
(514, 3, 179, NULL, 514, '2024-10-19 11:25:06', '2024-10-19 11:25:06'),
(515, 3, 80, NULL, 515, '2024-10-19 11:45:54', '2024-10-19 11:45:54'),
(516, 3, 10, NULL, 516, '2024-10-19 12:28:43', '2024-10-19 12:28:43'),
(517, 3, 78, NULL, 517, '2024-10-20 08:02:50', '2024-10-20 08:02:50'),
(518, 3, 180, NULL, 518, '2024-10-20 13:54:22', '2024-10-20 13:54:22'),
(519, 3, 101, NULL, 519, '2024-10-20 14:02:27', '2024-10-20 14:02:27'),
(520, 19, 178, NULL, 520, '2024-10-21 03:56:15', '2024-10-21 03:56:15'),
(521, 19, 178, NULL, 521, '2024-10-21 06:04:11', '2024-10-21 06:04:11'),
(522, 3, 75, NULL, 522, '2024-10-21 13:12:51', '2024-10-21 13:12:51'),
(523, 3, 39, NULL, 523, '2024-10-21 13:34:22', '2024-10-21 13:34:22'),
(524, 19, 181, NULL, 524, '2024-10-22 07:30:27', '2024-10-22 07:30:27'),
(525, 3, 182, NULL, 525, '2024-10-22 11:56:14', '2024-10-22 11:56:14'),
(526, 3, 183, NULL, 526, '2024-10-23 13:28:47', '2024-10-23 13:28:47'),
(527, 3, 39, NULL, 527, '2024-10-23 13:29:25', '2024-10-23 13:29:25'),
(528, 3, 65, NULL, 528, '2024-10-23 13:33:51', '2024-10-23 13:33:51'),
(529, 3, 53, NULL, 529, '2024-10-24 09:40:27', '2024-10-24 09:40:27'),
(530, 19, 187, NULL, 530, '2024-10-25 10:29:51', '2024-10-25 10:45:48'),
(531, 19, 186, NULL, 531, '2024-10-25 10:42:48', '2024-10-25 10:42:48'),
(532, 19, 188, NULL, 532, '2024-10-25 10:47:59', '2024-10-25 10:47:59'),
(533, 19, 189, NULL, 533, '2024-10-25 10:50:54', '2024-10-25 10:50:54'),
(534, 19, 190, NULL, 534, '2024-10-25 10:52:58', '2024-10-25 10:52:58'),
(535, 19, 191, NULL, 535, '2024-10-25 11:01:17', '2024-10-25 11:01:17'),
(536, 19, 192, NULL, 536, '2024-10-25 11:03:24', '2024-10-25 11:03:24'),
(537, 19, 193, NULL, 537, '2024-10-25 11:05:30', '2024-10-25 11:05:30'),
(538, 19, 194, NULL, 538, '2024-10-25 11:10:27', '2024-10-25 11:10:27'),
(539, 19, 195, NULL, 539, '2024-10-25 11:18:40', '2024-10-25 11:18:40'),
(540, 19, 196, NULL, 540, '2024-10-25 11:38:32', '2024-10-25 11:38:32'),
(541, 19, 197, NULL, 541, '2024-10-25 11:42:04', '2024-10-25 11:42:04'),
(542, 19, 198, NULL, 542, '2024-10-25 11:55:09', '2024-10-25 11:55:09'),
(543, 19, 199, NULL, 543, '2024-10-25 12:06:12', '2024-10-25 12:06:12'),
(544, 3, 25, NULL, 544, '2024-10-27 11:17:46', '2024-10-27 11:17:46'),
(545, 3, 200, NULL, 545, '2024-10-27 11:21:32', '2024-10-27 11:21:32'),
(546, 3, 201, NULL, 546, '2024-10-27 11:23:22', '2024-10-27 11:23:22'),
(547, 3, 202, NULL, 547, '2024-10-27 11:25:45', '2024-10-27 11:25:45'),
(548, 3, 202, NULL, 548, '2024-10-27 11:26:21', '2024-10-27 11:26:21'),
(549, 14, 204, NULL, 549, '2024-12-17 09:18:50', '2024-12-17 09:18:50');

-- --------------------------------------------------------

--
-- Table structure for table `machine_part_oem_part_nos_machine_models`
--

CREATE TABLE `machine_part_oem_part_nos_machine_models` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `primary_oem` varchar(255) DEFAULT NULL,
  `sale_price` double DEFAULT NULL,
  `purchase_price` double DEFAULT NULL,
  `purchase_dollar_rate` double NOT NULL DEFAULT 0,
  `min_price` double NOT NULL DEFAULT 0,
  `max_price` double NOT NULL DEFAULT 0,
  `last_sale_price` double NOT NULL DEFAULT 0,
  `machine_part_oem_part_no_id` bigint(20) NOT NULL,
  `machine_model_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `origin_id` int(11) DEFAULT NULL,
  `from_year` varchar(255) DEFAULT NULL,
  `to_year` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `avg_cost` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_part_oem_part_nos_machine_models`
--

INSERT INTO `machine_part_oem_part_nos_machine_models` (`id`, `user_id`, `name`, `primary_oem`, `sale_price`, `purchase_price`, `purchase_dollar_rate`, `min_price`, `max_price`, `last_sale_price`, `machine_part_oem_part_no_id`, `machine_model_id`, `brand_id`, `origin_id`, `from_year`, `to_year`, `created_at`, `updated_at`, `avg_cost`) VALUES
(1, 3, 'BOOM KIT/2440-9234/BT KOREA/S130-V 70mm', '2440-9234', 3500, 1650, 1650, 0, 0, 0, 1, 1, 96, 1, NULL, NULL, '2024-07-09 08:44:34', '2024-07-13 13:54:20', 0),
(2, 3, 'VALVE PLATE/HPV116 VALVE PLATE/HANDOK/', 'HPV116 VALVE PLATE', 20500, 17500, 17500, 0, 0, 19000, 2, 4, 97, 1, NULL, NULL, '2024-07-09 09:21:17', '2024-09-14 11:43:19', NULL),
(3, 3, 'VALVE PLATE SWING/M2X150/HANDOK/', 'M2X150', 12500, 10500, 10500, 0, 0, 0, 3, 4, 97, 2, NULL, NULL, '2024-07-09 09:24:55', '2024-09-01 12:35:10', 10500),
(4, 3, 'SET PLATE SWING/M2X150/HANDOK/', 'M2X150', 5500, 3500, 3500, 0, 0, 0, 4, 4, 97, 1, NULL, NULL, '2024-07-09 09:27:21', '2024-09-01 12:35:10', 3500),
(5, 3, 'PISTON SHOE PUMP/A8V080/HANDOK/', 'A8V080', 31000, 28000, 28000, 0, 0, 30000, 5, 3, 97, 1, NULL, NULL, '2024-07-09 09:57:41', '2024-09-19 09:07:15', NULL),
(6, 3, 'PUMP KIT/A8V080 KIT/NOK/', 'A8V080 KIT', 5500, 4000, 4000, 0, 0, 7000, 6, 3, 101, 1, NULL, NULL, '2024-07-09 09:59:57', '2024-09-22 05:06:12', 4000),
(7, 3, 'PUMP KIT/H5V80 KIT/NOK/', 'H5V80 KIT', 3000, 2500, 2500, 0, 0, 3500, 7, 2, 101, 1, NULL, NULL, '2024-07-09 10:01:19', '2024-09-01 12:35:10', 2500),
(8, 3, 'PISTON SHOE PUMP/H5V80/HANDOK/', 'H5V80', 17500, 17000, 17000, 0, 0, 17500, 8, 2, 97, 1, NULL, NULL, '2024-07-09 10:02:10', '2024-09-10 12:55:55', NULL),
(9, 3, 'DC FAN/FAN 24 V/LOCAL/', 'FAN 24 V', 2900, 2600, 2600, 0, 0, 2900, 9, 5, 103, NULL, NULL, NULL, '2024-07-09 10:45:57', '2024-09-10 07:13:29', NULL),
(10, 3, 'ARM KIT/EX-100/DONGBU/', 'EX-100', 2000, 1600, 1600, 0, 0, 1800, 10, 6, 100, 2, NULL, NULL, '2024-07-10 07:42:59', '2024-09-07 05:35:48', 1600),
(11, 3, 'BOOM KIT/EX-100/DONGBU/', 'EX-100', 2000, 1600, 1600, 0, 0, 1800, 11, 6, 100, 2, NULL, NULL, '2024-07-10 07:43:58', '2024-09-14 11:50:08', NULL),
(12, 3, 'BUCKET KIT/EX-100/DONGBU/', 'EX-100', 2000, 1600, 1600, 0, 0, 1800, 12, 6, 100, 2, NULL, NULL, '2024-07-10 07:44:31', '2024-09-15 05:40:03', 1600),
(13, 3, 'RAM KIT/EX-100/DONGBU/', 'EX-100', 1500, 950, 950, 0, 0, 1250, 13, 6, 100, 2, NULL, NULL, '2024-07-10 07:45:11', '2024-09-02 08:33:46', NULL),
(14, 3, 'CENTRE JOINT KIT/2440-9022T1/DONGBU/S130-V C/J SMALL', '2440-9022T1', 2500, 1800, 1800, 0, 0, 3000, 14, 1, 100, 1, NULL, NULL, '2024-07-10 07:52:12', '2024-09-02 08:04:35', NULL),
(15, 3, 'CENTRE JOINT KIT/2440-9022T2/DONGBU/S130-V C/J BIG', '2440-9022T2', NULL, NULL, 0, 0, 0, 0, 15, 1, 100, 1, NULL, NULL, '2024-07-10 07:53:11', '2024-07-10 07:53:11', 0),
(16, 3, 'COIL SPRING/H3V63/HANDOK/', 'H3V63', 200, 150, 150, 0, 0, 280, 16, 2, 97, 1, NULL, NULL, '2024-07-10 07:58:55', '2024-10-23 11:37:47', 150),
(18, 3, 'SET PLATE PUMP/H5V80/HANDOK/', 'H5V80', 4500, 3500, 3500, 0, 0, 4000, 18, 2, 97, 1, NULL, NULL, '2024-07-10 08:01:16', '2024-09-11 07:26:03', 3500),
(19, 3, 'VALVE PLATE/H5V80 LH/HANDOK/21975', 'H5V80 LH', 10500, 8000, 8000, 0, 0, 8500, 19, 2, 97, 1, NULL, NULL, '2024-07-10 08:07:45', '2024-09-11 05:39:25', 8000),
(20, 3, 'CYLINDER BLOCK/H5V80 LH/HANDOK/17299', 'H5V80 LH', NULL, NULL, 0, 0, 0, 0, 20, 2, 97, 1, NULL, NULL, '2024-07-10 10:54:00', '2024-07-10 10:54:00', 0),
(21, 3, 'VALVE PLATE/H5V80 RH/HANDOK/22224', 'H5V80 RH', 10500, 8000, 8000, 0, 0, 8500, 21, 2, 97, 1, NULL, NULL, '2024-07-10 10:54:37', '2024-09-11 05:39:25', 8000),
(22, 3, 'CYLINDER BLOCK/H5V80 RH/HANDOK/58922', 'H5V80 RH', NULL, NULL, 0, 0, 0, 0, 22, 1, 97, 1, NULL, NULL, '2024-07-10 10:55:13', '2024-07-10 10:55:13', 0),
(23, 3, 'SET PLATE SWING/M2X63/HANDOK/', 'M2X63', 5000, 3000, 3000, 0, 0, 0, 23, 2, 97, 1, NULL, NULL, '2024-07-10 11:03:03', '2024-09-02 08:37:53', 3000),
(24, 3, 'VALVE PLATE SWING/M2X63/HANDOK/', 'M2X63', 10500, 8500, 8500, 0, 0, 9500, 24, 2, 97, 1, NULL, NULL, '2024-07-10 11:04:54', '2024-10-15 12:20:50', 8500),
(25, 3, 'HYDRAULIC FILTER/EX-200-1/WILSON/', 'EX-200-1', 3500, 2800, 2800, 0, 0, 4000, 25, 7, 104, 1, NULL, NULL, '2024-07-10 11:47:30', '2024-10-15 12:10:52', 2800),
(26, 3, 'HYDRAULIC FILTER/WF-3051/WILSON/', 'WF-3051', 3000, 2600, 2600, 0, 0, 3500, 26, 2, 104, 1, NULL, NULL, '2024-07-10 11:50:21', '2024-09-11 07:01:43', 2600),
(27, 3, 'AIR FILTER/DX-140/WILSON/', 'DX-140', 6500, 5800, 5800, 0, 0, 7000, 27, 3, 104, 1, NULL, NULL, '2024-07-10 12:03:29', '2024-09-02 11:07:58', NULL),
(28, 3, 'GREES ADAPTER/GRESS ADAPTER/LOCAL/', 'GRESS ADAPTER', 150, 100, 100, 0, 0, 150, 28, 5, 103, NULL, NULL, NULL, '2024-07-10 12:18:31', '2024-09-02 11:07:58', NULL),
(30, 3, 'HORN/HORN 24-V/LOCAL/', 'HORN 24-V', 1500, 1200, 1200, 0, 0, 2000, 30, 5, 103, NULL, NULL, NULL, '2024-07-10 12:33:06', '2024-09-02 11:07:58', NULL),
(31, 3, 'LIGHT COVER BACK/DX-140/LOCAL/', 'DX-140', 150, 100, 100, 0, 0, 168, 31, 5, 103, NULL, NULL, NULL, '2024-07-10 12:34:51', '2024-09-02 11:07:58', NULL),
(32, 3, 'BULB/SINGLE POINT/LOCAL/', 'SINGLE POINT', 30, 20, 20, 0, 0, 30, 32, 5, 103, NULL, NULL, NULL, '2024-07-10 12:36:18', '2024-09-02 11:07:58', NULL),
(33, 3, 'FUEZ/10-AMP/LOCAL/', '10-AMP', 12, 8, 8, 0, 0, 11, 33, 5, 103, NULL, NULL, NULL, '2024-07-10 12:37:30', '2024-09-02 11:07:58', NULL),
(34, 3, 'FUEZ/15-AMP/LOCAL/', '15-AMP', 12, 8, 8, 0, 0, 11, 34, 5, 103, NULL, NULL, NULL, '2024-07-10 12:39:09', '2024-09-02 11:07:58', NULL),
(35, 3, 'FLASHER/FLASHER/LOCAL/', 'FLASHER', 300, 200, 200, 0, 0, 584, 35, 5, 103, NULL, NULL, NULL, '2024-07-10 12:42:58', '2024-09-02 11:07:58', NULL),
(36, 3, 'SENSOR/ASSY-DX-140/LOCAL/', 'ASSY-DX-140', 2500, 1700, 1700, 0, 0, 2500, 36, 5, 103, NULL, NULL, NULL, '2024-07-10 12:44:54', '2024-09-07 13:16:27', 1700),
(37, 3, 'TAIP/OSAKA/LOCAL/', 'OSAKA', 60, 30, 30, 0, 0, 50, 37, 5, 103, NULL, NULL, NULL, '2024-07-10 13:51:36', '2024-10-15 12:10:52', NULL),
(38, 3, 'GEAR PUMP/H3V112/HANDOK/', 'H3V112', 27500, 23000, 23000, 0, 0, 27500, 38, 10, 97, 1, NULL, NULL, '2024-07-10 14:00:34', '2024-09-07 08:15:05', 23000),
(39, 3, 'T/M SEAL KIT/DX-140/BT KOREA/', 'DX-140', 14000, 9000, 9000, 0, 0, 11000, 39, 3, 96, 1, NULL, NULL, '2024-07-10 14:09:00', '2024-09-14 13:29:08', 9000),
(40, 3, 'END SHIM/S-130-5/LOCAL/', 'S-130-5', 250, 83.334, 83.334, 0, 0, 0, 40, 2, 103, 1, NULL, NULL, '2024-07-10 14:30:04', '2024-09-02 11:27:36', 83.334),
(41, 3, 'LOCK/FRONT EXCEL DX-140/LOCAL/', 'FRONT EXCEL DX-140', 500, 125, 125, 0, 0, 0, 41, 3, 103, 1, NULL, NULL, '2024-07-10 14:32:29', '2024-09-02 11:27:36', 125),
(42, 3, 'COIL SPRING/32MM H5V80/LOCAL/', '32MM H5V80', 250, 111.111, 111.111, 0, 0, 0, 42, 2, 103, 1, NULL, NULL, '2024-07-10 14:33:29', '2024-09-02 11:27:36', 111.111),
(43, 3, 'GEAR PUMP/A8V080/YCYY/', 'A8V080', 29500, 26500, 26500, 0, 0, 26500, 43, 3, 105, 1, NULL, NULL, '2024-07-12 02:17:11', '2024-09-23 14:15:39', NULL),
(44, 3, 'GEAR PUMP/A8V86/YCYY/', 'A8V86', 29500, 26500, 26500, 0, 0, 0, 44, 9, 105, 1, NULL, NULL, '2024-07-12 02:18:49', '2024-09-02 11:53:37', 26500),
(45, 3, 'GEAR PUMP/H3V112/YCYY/', 'H3V112', 27500, 22500, 22500, 0, 0, 0, 45, 10, 105, 1, NULL, NULL, '2024-07-12 02:19:32', '2024-09-02 11:53:37', 22500),
(46, 3, 'HYDRAULIC FILTER/EX-200- 9404/UNITRUCK/UT-7066', 'EX-200- 9404', 5500, 4000, 4000, 0, 0, 5000, 46, 7, 106, 1, NULL, NULL, '2024-07-12 02:27:48', '2024-09-02 11:53:37', 4000),
(47, 3, 'HYDRAULIC FILTER/S-130-5 -9008/UNITRUCK/', 'S-130-5 -9008', 5000, 3600, 3600, 0, 0, 0, 47, 9, 106, 1, NULL, NULL, '2024-07-12 02:29:15', '2024-09-02 11:53:37', 3600),
(48, 3, 'AIR FILTER/S-130-5 9053K/UNITRUCK/', 'S-130-5 9053K', 9000, 7000, 7000, 0, 0, 0, 48, 2, 106, 1, NULL, NULL, '2024-07-12 02:30:54', '2024-09-02 11:53:37', 7000),
(49, 3, 'AIR FILTER/DX-140/UNITRUCK/', 'DX-140', 9500, 7500, 7500, 0, 0, 8000, 49, 3, 106, 1, NULL, NULL, '2024-07-12 02:31:50', '2024-09-19 11:24:32', 7500),
(50, 3, 'Water Separator Filter/DX-140/UNITRUCK/', 'DX-140', 5500, 3800, 3800, 0, 0, 6000, 50, 3, 106, 1, NULL, NULL, '2024-07-12 02:34:34', '2024-09-24 12:00:52', 3800),
(51, 3, 'FUEL FILTER/DX-140/UNITRUCK/', 'DX-140', 4000, 2500, 2500, 0, 0, 0, 51, 3, 106, 1, NULL, NULL, '2024-07-12 02:59:29', '2024-09-02 11:53:37', 2500),
(52, 3, 'OIL FILTER/DX-140/UNITRUCK/', 'DX-140', 4500, 2800, 2800, 0, 0, 0, 52, 3, 106, 1, NULL, NULL, '2024-07-12 03:00:05', '2024-09-02 11:53:37', 2800),
(53, 3, 'PILOT FILTER/DX-140/UNITRUCK/', 'DX-140', 2200, 1400, 1400, 0, 0, 0, 53, 3, 106, 1, NULL, NULL, '2024-07-12 03:02:31', '2024-09-02 11:53:37', 1400),
(54, 3, 'BRAKE FILTER/DX-140/UNITRUCK/', 'DX-140', 3000, 1900, 1900, 0, 0, 0, 54, 3, 106, 1, NULL, NULL, '2024-07-12 03:03:20', '2024-09-02 11:53:37', 1900),
(55, 3, 'SUCTION FILTER/S-130-5/UNITRUCK/', 'S-130-5', 4500, 3100, 3100, 0, 0, 0, 55, 10, 106, 1, NULL, NULL, '2024-07-12 03:04:56', '2024-09-02 11:53:37', 3100),
(56, 3, 'PILOT FILTER/S-130-5/UNITRUCK/', 'S-130-5', 1500, 1000, 1000, 0, 0, 0, 56, 2, 106, 1, NULL, NULL, '2024-07-12 03:31:23', '2024-09-02 11:58:45', 1000),
(57, 3, 'BRAKE FILTER/S-130-5/UNITRUCK/', 'S-130-5', 2000, 1200, 1200, 0, 0, 0, 57, 2, 106, 1, NULL, NULL, '2024-07-12 03:32:08', '2024-09-02 11:58:45', 1200),
(58, 3, 'SHAFT BERING/DX-140/koyo/FC-045', 'DX-140', 4500, 3500, 3500, 0, 0, 5000, 58, 3, 107, 1, NULL, NULL, '2024-07-12 03:47:23', '2024-09-22 05:06:12', 3500),
(59, 3, 'PISTON SHOE PUMP/H3V112/KIK/', 'H3V112', 24500, 22500, 22500, 0, 0, 0, 59, 10, 108, 1, NULL, NULL, '2024-07-12 03:51:43', '2024-09-02 12:11:42', 22500),
(60, 3, 'ASSYMBLY KIT BOX/DX-140/CHAINA/', 'DX-140', 5500, 4100, 4100, 0, 0, 0, 60, 3, 109, 1, NULL, NULL, '2024-07-12 03:57:58', '2024-09-02 12:52:48', 4100),
(61, 3, 'ASSYMBLY KIT BOX/EX200-1/CHAINA/', 'EX200-1', 5500, 4100, 4100, 0, 0, 0, 61, 4, 109, 2, NULL, NULL, '2024-07-12 03:58:59', '2024-09-02 12:52:48', 4100),
(62, 3, 'ASSYMBLY KIT BOX/S-130-5/CHAINA/', 'S-130-5', 6000, 4100, 4100, 0, 0, 0, 62, 2, 109, 1, NULL, NULL, '2024-07-12 04:00:00', '2024-09-02 12:52:48', 4100),
(63, 3, 'SHAFT BERING/30312/koyo/', '30312', 3500, 3000, 3000, 0, 0, 3500, 63, 4, 107, 2, NULL, NULL, '2024-07-12 04:02:42', '2024-10-21 12:35:20', 3000),
(64, 3, 'SHAFT BERING/30212/koyo/', '30212', 2500, 1500, 1500, 0, 0, 0, 64, 4, 107, 2, NULL, NULL, '2024-07-12 04:03:38', '2024-09-02 12:52:49', 1500),
(65, 3, 'HOUSING BERING/6014/koyo/', '6014', 2000, 1300, 1300, 0, 0, 2500, 65, 4, 107, 2, NULL, NULL, '2024-07-12 04:06:01', '2024-10-21 13:29:56', 1300),
(66, 3, 'HOUSING BERING/6213/koyo/', '6213', 2000, 1300, 1300, 0, 0, 2500, 66, 4, 107, 2, NULL, NULL, '2024-07-12 04:06:57', '2024-10-21 13:29:56', 1300),
(67, 3, 'SHAFT BERING/NUP-307E/koyo/', 'NUP-307E', 3500, 2500, 2500, 0, 0, 0, 67, 2, 107, 1, NULL, NULL, '2024-07-12 04:07:39', '2024-09-02 12:52:49', 2500),
(68, 3, 'CUP BUSH/7030/koyo/', '7030', 550, 360, 360, 0, 0, 0, 68, 7, 107, 1, NULL, NULL, '2024-07-12 04:12:32', '2024-09-02 12:52:49', 360),
(69, 3, 'CUP BUSH/7530/CHAINA/', '7530', 570, 382, 382, 0, 0, 850, 69, 9, 109, 1, NULL, NULL, '2024-07-12 04:13:33', '2024-10-16 12:13:52', 382),
(70, 3, 'CUP BUSH/8530/CHAINA/', '8530', 750, 435, 435, 0, 0, 0, 70, 4, 109, 2, NULL, NULL, '2024-07-12 04:14:36', '2024-09-02 12:52:49', 435),
(71, 3, 'CUP BUSH/8030/CHAINA/', '8030', 750, 410, 410, 0, 0, 700, 71, 10, 109, 2, NULL, NULL, '2024-07-12 04:15:14', '2024-09-14 13:26:48', 410),
(72, 3, 'GEAR PUMP/H3V63/FIRST/', 'H3V63', NULL, 11000, 11000, 0, 0, 0, 72, 1, 111, 1, NULL, NULL, '2024-07-12 04:42:23', '2024-09-02 13:23:20', 11000),
(73, 3, 'GEAR PUMP/A8V080/FIRST/', 'A8V080', NULL, NULL, 0, 0, 0, 0, 73, 3, 111, 1, NULL, NULL, '2024-07-12 04:45:16', '2024-07-12 04:45:16', 0),
(74, 3, 'SWING DEVICE SEAL/EX200-1/CHAINA/', 'EX200-1', 3000, 2100, 2100, 0, 0, 4000, 74, 4, 109, 2, NULL, NULL, '2024-07-12 04:48:58', '2024-10-15 12:10:52', 2100),
(75, 3, 'BELLOW SEAL/EX200-1/CHAINA/', 'EX200-1', 4000, 3600, 3600, 0, 0, 0, 75, 4, 109, 2, NULL, NULL, '2024-07-12 04:49:41', '2024-09-02 13:23:20', 3600),
(76, 3, 'HYDRAULIC GAUGE/EX200-1/CHAINA/', 'EX200-1', 950, 550, 550, 0, 0, 1150, 76, 4, 109, 2, NULL, NULL, '2024-07-12 04:50:14', '2024-10-15 12:10:52', 550),
(77, 3, 'HYDRAULIC GAUGE/S-130-5/CHAINA/', 'S-130-5', 950, 580, 580, 0, 0, 1500, 77, 1, 109, 1, NULL, NULL, '2024-07-12 04:52:04', '2024-10-15 12:20:50', 565),
(78, 3, 'HYDRAULIC GAUGE/R-1400/CHAINA/', 'R-1400', 1000, 600, 600, 0, 0, 1800, 78, 11, 109, 1, NULL, NULL, '2024-07-12 04:53:44', '2024-09-23 12:51:17', 600),
(79, 3, 'JACK HAMMER KIT/SB-81/CHAINA/', 'SB-81', 4000, 2700, 2700, 0, 0, 0, 79, 10, 109, 2, NULL, NULL, '2024-07-12 08:01:29', '2024-09-02 13:23:20', 2700),
(80, 3, 'JACK HAMMER KIT/SB-50/CHAINA/', 'SB-50', 3500, 2000, 2000, 0, 0, 3500, 80, 3, 109, 1, NULL, NULL, '2024-07-12 08:02:21', '2024-09-24 11:59:55', NULL),
(81, 3, 'JACK HAMMER KIT/NPK-10XB/USA/', 'NPK-10XB', 7500, 4500, 4500, 0, 0, 0, 81, 4, 112, 2, NULL, NULL, '2024-07-12 08:03:25', '2024-09-02 13:23:20', 4500),
(82, 3, 'JACK HAMMER KIT/SB-70/CHAINA/', 'SB-70', 4000, 3200, 3200, 0, 0, 0, 82, 4, 109, 2, NULL, NULL, '2024-07-12 08:04:07', '2024-09-02 13:23:20', 3200),
(83, 3, 'TURBO CHARGER/EX200-1/CHAINA/', 'EX200-1', 22000, 19500, 19500, 0, 0, 0, 83, 4, 109, 2, NULL, NULL, '2024-07-12 08:05:25', '2024-09-04 12:14:24', 20000),
(84, 3, 'TURBO CHARGER/S-130-5/CHAINA/', 'S-130-5', 22000, 20500, 20500, 0, 0, 22500, 84, 1, 109, 1, NULL, NULL, '2024-07-12 08:05:56', '2024-09-10 12:32:56', NULL),
(85, 3, 'GEAR PUMP/EX200-1/CHAINA (HD)/', 'EX200-1', 10500, 9500, 9500, 0, 0, 11000, 85, 4, 110, 2, NULL, NULL, '2024-07-12 08:06:55', '2024-09-02 13:23:20', 9500),
(86, 3, 'GEAR PUMP/DX-140/FIRST/', 'DX-140', 15500, 12000, 12000, 0, 0, 0, 86, 3, 111, 1, NULL, NULL, '2024-07-12 08:08:01', '2024-09-02 13:23:20', 12000),
(87, 3, 'GEAR PUMP/S-130-5/FIRST/', 'S-130-5', 13500, 11000, 11000, 0, 0, 0, 87, 1, 111, 1, NULL, NULL, '2024-07-12 08:08:25', '2024-07-12 08:23:19', 0),
(88, 3, 'CHAIN ADAPTER/EX200-1/CHAINA/', 'EX200-1', 200, 150, 150, 0, 0, 350, 88, 4, 109, 2, NULL, NULL, '2024-07-12 08:11:13', '2024-09-11 05:20:16', 150),
(89, 3, 'RACE CABLE/EX200-1/CHAINA/', 'EX200-1', 1500, 1200, 1200, 0, 0, 0, 89, 5, 109, NULL, NULL, NULL, '2024-07-12 08:12:30', '2024-09-02 13:28:26', 1200),
(90, 3, 'HAMMER GASS GAUGE/SB-70/CHAINA/SB-81', 'SB-70', 2800, 2500, 2500, 0, 0, 0, 90, 4, 109, NULL, NULL, NULL, '2024-07-12 08:26:53', '2024-09-02 13:28:26', 2500),
(91, 3, 'PILOT PUMP KIT/EX200-1/DONGBU/', 'EX200-1', 750, 550, 550, 0, 0, 750, 91, 4, 100, 2, NULL, NULL, '2024-07-12 13:00:47', '2024-09-14 11:43:19', 550),
(92, 3, 'ANGLE LOCK/S-130-5/CHAINA/', 'S-130-5', 250, 170, 170, 0, 0, 200, 92, 9, 109, 1, NULL, NULL, '2024-07-12 13:07:11', '2024-09-22 05:10:49', 170),
(93, 3, 'LEVER KIT/EX200-1/BT KOREA CHN/', 'EX200-1', 750, 250, 250, 0, 0, 0, 93, 4, 99, 2, NULL, NULL, '2024-07-12 13:09:12', '2024-09-02 13:42:36', 250),
(94, 3, 'RETAINING RING-DANDI LOCK/S-130-5/CHAINA/', 'S-130-5', 800, 250, 250, 0, 0, 0, 94, 9, 109, 1, NULL, NULL, '2024-07-12 13:10:23', '2024-09-02 13:42:36', 250),
(95, 3, 'THRUST WASHEL/S-130-5/CHAINA/', 'S-130-5', 950, 150, 150, 0, 0, 1000, 95, 9, 109, 1, NULL, NULL, '2024-07-12 13:12:04', '2024-10-19 11:35:51', NULL),
(96, 3, 'RACE PRDAL KIT/S-130-5/BT KOREA CHN/', 'S-130-5', 850, 350, 350, 0, 0, 750, 96, 9, 99, NULL, NULL, NULL, '2024-07-12 13:16:06', '2024-10-15 12:20:50', 350),
(97, 3, 'LEVER SPOOL/12MM S-130-3/CHAINA/', '12MM S-130-3', 650, 380, 380, 0, 0, 0, 97, 9, 109, 1, NULL, NULL, '2024-07-12 13:17:31', '2024-09-02 13:42:36', 380),
(98, 3, 'LEVER SPOOL/10MM S140-5/CHAINA/', '10MM S140-5', 650, 360, 360, 0, 0, 900, 98, 2, 109, 1, NULL, NULL, '2024-07-12 13:18:39', '2024-10-19 11:35:51', 360),
(99, 3, 'LEVER SPOOL/DX-140/CHAINA/', 'DX-140', 700, 380, 380, 0, 0, 690, 99, 3, 109, NULL, NULL, NULL, '2024-07-12 13:21:18', '2024-09-19 09:11:23', 380),
(100, 3, 'CHAIN ADJUSTER KIT/EX200-1/BT KOREA CHN/', 'EX200-1', 1000, 450, 450, 0, 0, 0, 100, 4, 99, 2, NULL, NULL, '2024-07-12 13:22:18', '2024-07-12 14:01:31', 0),
(101, 3, 'LEVER KIT/(D) EX200-1/BT KOREA CHN/', '(D) EX200-1', 1000, 450, 450, 0, 0, 800, 101, 4, 99, 2, NULL, NULL, '2024-07-12 13:23:40', '2024-09-14 11:44:29', 450),
(102, 3, 'GODA SEAL/S-130-5/BT KOREA/56*75*22', 'S-130-5', 1500, 550, 550, 0, 0, 1950, 102, 9, 96, 1, NULL, NULL, '2024-07-12 13:24:58', '2024-09-10 06:46:05', 538.46153846154),
(103, 3, 'WHEEL GEAR BERING/S-130-5/koyo/567079B', 'S-130-5', 1500, 530, 530, 0, 0, 0, 103, 9, 107, NULL, NULL, NULL, '2024-07-12 13:26:13', '2024-09-02 13:42:36', 530),
(104, 3, 'GODA SEAL/dx-140/BT KOREA/46*65*21', 'dx-140', 2000, 600, 600, 0, 0, 0, 104, 3, 96, 1, NULL, NULL, '2024-07-13 04:32:36', '2024-09-05 05:13:01', 590),
(105, 3, 'LEVER SPOOL/(B) EX200-1/CHAINA/', '(B) EX200-1', 950, 580, 580, 0, 0, 0, 105, 4, 109, 1, NULL, NULL, '2024-07-13 04:34:35', '2024-09-03 05:25:07', 580),
(106, 3, 'LEVER SPOOL/(S) EX200-1/CHAINA/', '(S) EX200-1', 950, 580, 580, 0, 0, 0, 106, 4, 109, 2, NULL, NULL, '2024-07-13 04:35:13', '2024-09-03 05:25:07', 580),
(107, 3, 'LEVER CROSS/EX200-1/CHAINA/', 'EX200-1', 1000, 580, 580, 0, 0, 800, 107, 4, 109, 2, NULL, NULL, '2024-07-13 04:39:55', '2024-09-23 13:21:31', 580),
(108, 3, 'GODA SEAL/R-1400/BT KOREA/50*65*18', 'R-1400', 1500, 580, 580, 0, 0, 2000, 108, 11, 96, 1, NULL, NULL, '2024-07-13 04:41:18', '2024-09-14 13:14:33', 580),
(109, 3, 'BRAKE KIT/EW-130/BT KOREA/', 'EW-130', 2500, 650, 650, 0, 0, 0, 109, 7, 96, 1, NULL, NULL, '2024-07-13 04:42:48', '2024-09-03 05:25:07', 650),
(110, 3, 'COUPLING RUBBER/50-H/CHAINA/', '50-H', 1500, 850, 850, 0, 0, 1500, 110, 4, 109, 2, NULL, NULL, '2024-07-13 04:45:32', '2024-10-15 12:20:50', 850),
(111, 3, 'RACE & BRAKE SPOOL/S-130-5/CHAINA/', 'S-130-5', 1500, 850, 850, 0, 0, 0, 111, 2, 109, 1, NULL, NULL, '2024-07-13 06:13:12', '2024-09-03 05:25:07', 850),
(112, 3, 'HUB SEAL/S-130-5/BT KOREA/136.8*165*13', 'S-130-5', 2200, 950, 950, 0, 0, 4000, 112, 2, 96, 1, NULL, NULL, '2024-07-13 06:15:31', '2024-10-19 11:35:51', 950),
(113, 3, 'HUB SEAL/EW-130/BT KOREA/120*150*14', 'EW-130', 2200, 950, 950, 0, 0, 0, 113, 7, 96, 1, NULL, NULL, '2024-07-13 06:17:16', '2024-09-03 05:25:07', 950),
(114, 3, 'SWING MOTOR KIT/M2X150/DONGBU/', 'M2X150', 1500, 1250, 1250, 0, 0, 2000, 114, 4, 100, 2, NULL, NULL, '2024-07-13 06:19:21', '2024-09-14 13:18:41', 1125),
(115, 3, 'CROSS/30*82/CHAINA/', '30*82', 1800, 1050, 1050, 0, 0, 1700, 115, 3, 109, 1, NULL, NULL, '2024-07-13 06:20:33', '2024-10-03 05:03:01', 1050),
(116, 3, 'BLADE SPOOL/S-130-5/CHAINA/DX-140', 'S-130-5', 1800, 850, 850, 0, 0, 1500, 116, 3, 109, 1, NULL, NULL, '2024-07-13 06:24:51', '2024-10-19 11:35:51', NULL),
(117, 3, 'CRAWLING SPOOL/EX200-1/CHAINA/', 'EX200-1', NULL, 950, 950, 0, 0, 0, 117, 4, 109, 2, NULL, NULL, '2024-07-13 06:32:29', '2024-09-03 05:25:07', 950),
(118, 3, 'CRAWLING SPOOL/EX200-1/CHAINA/', 'EX200-1', 1950, 950, 950, 0, 0, 0, 118, 4, 109, 2, NULL, NULL, '2024-07-13 06:48:42', '2024-07-13 07:59:50', 0),
(119, 3, 'SWING MOTOR KIT/MX-173/DONGBU/', 'MX-173', 1800, 1000, 1000, 0, 0, 0, 119, 4, 100, 2, NULL, NULL, '2024-07-13 06:49:24', '2024-09-03 05:25:07', 1000),
(120, 3, 'GODA BUSH/DX-140/CHAINA/', 'DX-140', 1500, 900, 900, 0, 0, 1500, 120, 3, 109, 1, NULL, NULL, '2024-07-13 06:49:57', '2024-09-03 05:40:44', 900),
(121, 3, 'RAM KIT/S-130-5/DONGBU/', 'S-130-5', 1800, 1100, 1100, 0, 0, 1500, 121, 9, 100, 1, NULL, NULL, '2024-07-13 06:52:14', '2024-09-19 11:23:23', 1100),
(122, 3, 'RAM KIT/S-130-5/BT KOREA/', 'S-130-5', 3000, 1100, 1100, 0, 0, 2000, 122, 9, 96, 1, NULL, NULL, '2024-07-13 06:52:48', '2024-09-11 07:35:50', NULL),
(123, 3, 'HUB SEAL/DX-140/BT KOREA/150.15*178*13/16', 'DX-140', 2500, 1200, 1200, 0, 0, 0, 123, 3, 96, 1, NULL, NULL, '2024-07-13 06:53:47', '2024-09-03 05:40:44', 1200),
(124, 3, 'HUB SEAL/R-1400/BT KOREA/145*175*14.5/15.5', 'R-1400', NULL, 1200, 1200, 0, 0, 4000, 124, 11, 96, 1, NULL, NULL, '2024-07-13 06:54:53', '2024-10-02 13:29:38', 1200),
(125, 3, 'WHEEL GEAR BERING/DX-140/koyo/F-554377', 'DX-140', 1500, 1250, 1250, 0, 0, 2000, 125, 3, 107, 1, NULL, NULL, '2024-07-13 06:56:33', '2024-09-29 10:34:51', 1250),
(126, 3, 'CENTRE JOINT KIT/EX200-1/DONGBU/', 'EX200-1', 1800, 1250, 1250, 0, 0, 2500, 126, 4, 100, 2, NULL, NULL, '2024-07-13 06:58:04', '2024-09-03 05:40:44', 1250),
(127, 3, 'CENTRE JOINT KIT/EX200-1/BT KOREA/2440-9464', 'EX200-1', 3500, 1250, 1250, 0, 0, 0, 127, 4, 96, 2, NULL, NULL, '2024-07-13 06:58:45', '2024-09-03 05:40:44', 1250),
(128, 3, 'GODA BERING/S-130-5/koyo/804846', 'S-130-5', 2500, 1400, 1400, 0, 0, 0, 128, 9, 107, 1, NULL, NULL, '2024-07-13 07:01:58', '2024-09-03 05:40:44', 1400),
(129, 3, 'GODA BERING/DX-140/koyo/801349', 'DX-140', 2800, 1450, 1450, 0, 0, 3000, 129, 3, 107, 1, NULL, NULL, '2024-07-13 07:02:38', '2024-09-19 11:11:42', 1450),
(130, 3, 'O-RING/HITACHI/CHAINA/', 'HITACHI', 2500, 1300, 1300, 0, 0, 0, 130, 4, 109, 2, NULL, NULL, '2024-07-13 07:38:00', '2024-09-04 06:22:23', 1340.9090909091),
(131, 3, 'BRAKE KIT/S-130-5/BT KOREA/', 'S-130-5', 3500, 1500, 1500, 0, 0, 3000, 131, 9, 96, 1, NULL, NULL, '2024-07-13 07:40:01', '2024-09-10 06:46:05', 1480),
(132, 3, 'CRAWLING SPOOL/S-130-5/CHAINA/', 'S-130-5', 1950, 1500, 1500, 0, 0, 0, 132, 1, 109, 1, NULL, NULL, '2024-07-13 07:43:04', '2024-09-03 05:40:44', 1500),
(133, 3, 'ARM KIT/S-130-5/BT KOREA/2440-9404', 'S-130-5', 4000, 1650, 1650, 0, 0, 4000, 133, 1, 96, 1, NULL, NULL, '2024-07-13 07:44:09', '2024-10-16 12:13:52', NULL),
(134, 3, 'BOOM KIT/S-130-5/BT KOREA/2440-9234', 'S-130-5', 4000, 1650, 1650, 0, 0, 4000, 134, 1, 96, 1, NULL, NULL, '2024-07-13 07:44:57', '2024-09-11 07:01:43', 1650),
(135, 3, 'GODA BUSH/S-130-5/DONGBU/2440-9452', 'S-130-5', 1500, 900, 900, 0, 0, 1500, 135, 9, 100, 1, NULL, NULL, '2024-07-13 08:05:54', '2024-09-03 05:40:44', 900),
(136, 3, 'SUCTION FILTER/S-130-5/WILSON/WF-3055', 'S-130-5', 3000, 2300, 2300, 0, 0, 0, 136, 3, 104, 1, NULL, NULL, '2024-07-13 08:15:33', '2024-09-03 05:44:31', 2300),
(137, 3, 'BUCKET KIT/S-130-5/BT KOREA/2440-9405', 'S-130-5', 3500, 1650, 1650, 0, 0, 4000, 137, 2, 96, 1, NULL, NULL, '2024-07-13 10:19:06', '2024-10-16 12:13:52', 1650),
(138, 3, 'ARM KIT/DX-140/BT KOREA/K9002308', 'DX-140', 3500, 1650, 1650, 0, 0, 0, 138, 3, 96, 1, NULL, NULL, '2024-07-13 10:23:55', '2024-09-03 06:13:34', 1650),
(139, 3, 'BOOM KIT/DX-140/BT KOREA/K9002306', 'DX-140', 3500, 1650, 1650, 0, 0, 0, 139, 3, 96, 1, NULL, NULL, '2024-07-13 10:50:35', '2024-09-03 06:13:34', 1650),
(140, 3, 'BUCKET KIT/DX-140/BT KOREA/K9002307', 'DX-140', 3500, 1650, 1650, 0, 0, 2200, 140, 3, 96, 1, NULL, NULL, '2024-07-13 11:08:00', '2024-10-27 06:43:04', 1650),
(141, 3, 'BRAKE KIT/DX-140/BT KOREA/ZGAQ-02922', 'DX-140', 4000, 1650, 1650, 0, 0, 3250, 141, 3, 96, 1, NULL, NULL, '2024-07-13 11:09:48', '2024-09-03 06:13:34', 1650),
(142, 3, 'ARM KIT/EX200-1/BT KOREA/2440-4286', 'EX200-1', 4000, 1650, 1650, 0, 0, 2500, 142, 4, 96, 2, NULL, NULL, '2024-07-13 11:10:37', '2024-09-10 12:02:58', 1650),
(143, 3, 'BOOM KIT/EX200-1/BT KOREA/2440-4287', 'EX200-1', 3500, 1650, 1650, 0, 0, 2500, 143, 4, 96, 2, NULL, NULL, '2024-07-13 11:11:08', '2024-09-14 13:18:41', 1650),
(144, 3, 'BUCKET KIT/EX200-1/BT KOREA/2440-4288', 'EX200-1', 3500, 1650, 1650, 0, 0, 2500, 144, 4, 96, 2, NULL, NULL, '2024-07-13 11:11:43', '2024-09-14 13:18:41', 1650),
(145, 3, 'ARM KIT/EX200-1/DONGBU/2440-4286', 'EX200-1', 2500, 1650, 1650, 0, 0, 2500, 145, 4, 100, 2, NULL, NULL, '2024-07-13 11:15:27', '2024-10-27 06:46:57', NULL),
(146, 3, 'BOOM KIT/EX200-1/DONGBU/2440-4287', 'EX200-1', 2500, 1650, 1650, 0, 0, 2500, 146, 4, 100, 2, NULL, NULL, '2024-07-13 11:17:13', '2024-10-27 06:46:57', NULL),
(147, 3, 'BUCKET KIT/EX200-1/DONGBU/2440-4288', 'EX200-1', 2500, 1650, 1650, 0, 0, 2500, 147, 4, 100, 2, NULL, NULL, '2024-07-13 11:17:50', '2024-10-27 06:46:57', NULL),
(148, 3, 'ARM KIT/R-1400/BT KOREA/31Y1-18110', 'R-1400', 4000, 1650, 1650, 0, 0, 0, 148, 11, 96, 1, NULL, NULL, '2024-07-13 11:19:38', '2024-09-03 06:13:34', 1650),
(149, 3, 'BOOM KIT/R-1400/BT KOREA/31Y1-18310', 'R-1400', 3500, 1650, 1650, 0, 0, 0, 149, 11, 96, 1, NULL, NULL, '2024-07-13 11:20:16', '2024-09-03 06:13:34', 1650),
(150, 3, 'BUCKET KIT/R-1400/BT KOREA/31Y1-18210', 'R-1400', 3500, 1650, 1650, 0, 0, 4000, 150, 11, 96, 1, NULL, NULL, '2024-07-13 11:21:38', '2024-10-02 13:29:38', NULL),
(151, 3, 'BOOM KIT/S-130-3/BT KOREA/2440-9127', 'S-130-3', 3500, 1650, 1650, 0, 0, 0, 151, 9, 96, 1, NULL, NULL, '2024-07-13 11:24:24', '2024-09-03 06:13:34', 1650),
(152, 3, 'BUCKET KIT/S-130-5/BT KOREA/2440-9233', 'S-130-5', NULL, NULL, 0, 0, 0, 0, 152, 2, 96, 1, NULL, NULL, '2024-07-13 11:26:05', '2024-07-13 11:26:05', 0),
(153, 3, 'DOZER KIT/S-130-5/BT KOREA/2440-9164', 'S-130-5', 3000, 1650, 1650, 0, 0, 2700, 153, 3, 96, 1, NULL, NULL, '2024-07-13 11:27:42', '2024-09-03 06:13:34', 1650),
(154, 3, 'ARM KIT/EW-130/BT KOREA/8048-11020', 'EW-130', 4000, 1650, 1650, 0, 0, 0, 154, 7, 96, 1, NULL, NULL, '2024-07-13 12:35:06', '2024-09-03 06:27:45', 1650),
(155, 3, 'BOOM KIT/EW-130/BT KOREA/8048-11010', 'EW-130', 3750, 1650, 1650, 0, 0, 0, 155, 7, 96, 1, NULL, NULL, '2024-07-13 12:35:50', '2024-09-03 06:27:45', 1650),
(156, 3, 'BUCKET KIT/EW-130/BT KOREA/8048-11030', 'EW-130', 3500, 1650, 1650, 0, 0, 0, 156, 7, 96, 1, NULL, NULL, '2024-07-13 12:36:31', '2024-09-03 06:27:45', 1650),
(157, 3, 'ARM KIT/S140-5/BT KOREA/2440-9217', 'S140-5', 4000, 1650, 1650, 0, 0, 3000, 157, 2, 96, 1, NULL, NULL, '2024-07-13 12:38:17', '2024-09-10 07:33:17', NULL),
(158, 3, 'ARM KIT/S140-5/DONGBU/2440-9217', 'S140-5', 3000, 1700, 1700, 0, 0, 1800, 158, 2, 100, 1, NULL, NULL, '2024-07-13 12:38:40', '2024-07-22 10:08:47', 0),
(159, 3, 'HUB BERING/37425-37625/koyo/', '37425-37625', 3000, 1800, 1800, 0, 0, 3000, 159, 2, 107, 1, NULL, NULL, '2024-07-13 13:06:29', '2024-10-22 11:04:30', NULL),
(160, 3, 'HUB BERING/37431-37625/koyo/', '37431-37625', 3000, 1800, 1800, 0, 0, 0, 160, 3, 107, 1, NULL, NULL, '2024-07-13 13:07:25', '2024-09-03 06:27:45', 1800),
(161, 3, 'RAM KIT/DX-140/BT KOREA/K9003707', 'DX-140', 4000, 1800, 1800, 0, 0, 0, 161, 3, 96, NULL, NULL, NULL, '2024-07-13 13:09:04', '2024-09-03 06:27:45', 1800),
(162, 3, 'ASSYMBLY KIT/EX200-1/BT KOREA CHN/2440-9469', 'EX200-1', 3000, 2200, 2200, 0, 0, 0, 162, 4, 99, 2, NULL, NULL, '2024-07-13 13:10:42', '2024-07-13 13:54:20', 0),
(163, 3, 'ASSYMBLY KIT/EX200-1/BT KOREA/2440-9469', 'EX200-1', 4000, 2200, 2200, 0, 0, 0, 163, 4, 96, 2, NULL, NULL, '2024-07-13 13:11:36', '2024-09-03 06:27:45', 2200),
(164, 3, 'WHEEL GEAR/S-130-5/KYG CHAINA/4472 364 006', 'S-130-5', 3000, 2250, 2250, 0, 0, 0, 164, 9, 113, 1, NULL, NULL, '2024-07-13 13:16:34', '2024-09-03 06:27:45', 2250),
(165, 3, 'WHEEL GEAR/S/L DX-140/KYG CHAINA/ZGAQ-03163', 'S/L DX-140', 3500, 2450, 2450, 0, 0, 0, 165, 3, 113, 1, NULL, NULL, '2024-07-13 13:18:11', '2024-09-03 06:27:45', 2450),
(166, 3, 'COUPLING RUBBER/110-H/CHAINA/', '110-H', 3500, 2350, 2350, 0, 0, 0, 166, 4, 109, 2, NULL, NULL, '2024-07-13 13:19:27', '2024-09-03 06:27:45', 2350),
(167, 3, 'COUPLING COMPLETE/50-H/CHAINA/', '50-H', 4500, 2800, 2800, 0, 0, 0, 167, 3, 109, 1, NULL, NULL, '2024-07-13 13:23:33', '2024-09-03 06:27:45', 2800),
(168, 3, 'SUN GEAR/REAR S130-5/KYG CHAINA/4472 319 161', 'REAR S130-5', 3250, 2450, 2450, 0, 0, 0, 168, 2, 113, 1, NULL, NULL, '2024-07-13 13:27:46', '2024-09-03 06:27:45', 2450),
(169, 3, 'CENTRE JOINT KIT/DX-140/BT KOREA/K9002317', 'DX-140', 12500, 4500, 4500, 0, 0, 11500, 169, 3, 96, 1, NULL, NULL, '2024-07-14 05:00:08', '2024-09-03 07:51:22', 4500),
(170, 3, 'ASSYMBLY KIT/(J) S130-5/BT KOREA/2440-9467', '(J) S130-5', 10500, 4500, 4500, 0, 0, 0, 170, 2, 96, 1, NULL, NULL, '2024-07-14 05:01:12', '2024-09-03 07:51:22', 4500),
(171, 3, 'CENTRE JOINT KIT/S-130-5 C/J SMALL/BT KOREA/2440-9022T1', 'S-130-5 C/J SMALL', 6500, 1500, 1500, 0, 0, 2000, 171, 1, 96, 1, NULL, NULL, '2024-07-14 05:04:30', '2024-09-03 07:51:22', 1500),
(172, 3, 'CENTRE JOINT KIT/S-130-5 C/J BIG/BT KOREA/2440-9022T2', 'S-130-5 C/J BIG', 4500, 3300, 3300, 0, 0, 5000, 172, 1, 96, 1, NULL, NULL, '2024-07-14 05:05:12', '2024-09-14 13:11:45', 3300),
(173, 3, 'CENTRE JOINT KIT/S-130-3 C/J BIG/BT KOREA/2480-9004H2', 'S-130-3 C/J BIG', 5500, 3000, 3000, 0, 0, 0, 173, 9, 96, 1, NULL, NULL, '2024-07-14 05:06:14', '2024-09-03 07:51:22', 3000),
(174, 3, 'CENTRE JOINT KIT/S-130-3 C/J SMALL/BT KOREA/2480-9004H1', 'S-130-3 C/J SMALL', 3500, 1800, 1800, 0, 0, 0, 174, 9, 96, 1, NULL, NULL, '2024-07-14 05:06:50', '2024-09-03 07:51:22', 1800),
(175, 3, 'SUN GEAR/FRONT S130-5/KYG CHAINA/4472 319 157', 'FRONT S130-5', 6000, 5300, 5300, 0, 0, 0, 175, 9, 113, 1, NULL, NULL, '2024-07-14 05:09:00', '2024-09-03 07:51:22', 5300),
(176, 3, 'PL-2 GEAR/S-130-5/KYG CHAINA/404-00063', 'S-130-5', 3500, 2800, 2800, 0, 0, 0, 176, 2, 113, 1, NULL, NULL, '2024-07-14 05:12:42', '2024-09-03 07:51:22', 2800),
(177, 3, 'PL-2 SUN GEAR/S-130-5/KYG CHAINA/404-00064', 'S-130-5', 5000, 3800, 3800, 0, 0, 5000, 177, 9, 113, 1, NULL, NULL, '2024-07-14 05:13:31', '2024-10-15 12:20:50', NULL),
(178, 3, 'BRAKE KIT/DX-140/YBS/2350-9462K', 'DX-140', 2000, 1300, 1300, 0, 0, 1650, 178, 3, 102, 1, NULL, NULL, '2024-07-14 05:39:47', '2024-09-10 07:05:31', 1300),
(179, 3, 'T/M LEATHER PLATE/(SMALL) S-130-5/CHAINA/', '(SMALL) S-130-5', 750, 250, 250, 0, 0, 350, 179, 1, 109, 1, NULL, NULL, '2024-07-14 05:43:57', '2024-09-10 13:18:44', NULL),
(180, 3, 'T/M LEATHER PLATE/(SMALL) DX-140/CHAINA/', '(SMALL) DX-140', 750, 500, 500, 0, 0, 600, 180, 3, 109, 1, NULL, NULL, '2024-07-14 05:44:50', '2024-09-07 12:55:42', 336.36363636364),
(181, 3, 'INNER DRUM/S140-5/CHAINA/4 GEAR', 'S140-5', 27500, 21900, 21900, 0, 0, 0, 181, 2, 109, 1, NULL, NULL, '2024-07-14 05:48:17', '2024-09-03 08:03:23', 21900),
(182, 3, 'BALL GUIDE/H3V112/HANDOK/', 'H3V112', 5500, 3250, 3250, 0, 0, 0, 182, 10, 97, 1, NULL, NULL, '2024-07-14 06:14:56', '2024-09-03 08:07:58', 3250),
(183, 3, 'HUB BERING/DX-140/koyo/JP10049/JP10010', 'DX-140', 3500, 2500, 2500, 0, 0, 0, 183, 3, 107, 1, NULL, NULL, '2024-07-14 07:44:31', '2024-09-03 08:11:04', 2500),
(184, 3, 'PUMP KIT/EX200-1/BT KOREA/HPV116', 'EX200-1', 2000, 900, 900, 0, 0, 2000, 184, 4, 96, 2, NULL, NULL, '2024-07-14 07:47:51', '2024-09-19 09:09:28', 900),
(185, 3, 'DEASEL JALI/EX200-1/CHAINA/', 'EX200-1', 1500, 1000, 1000, 0, 0, 0, 185, 4, 109, 2, NULL, NULL, '2024-07-14 08:04:22', '2024-09-03 08:57:13', 1000),
(186, 3, 'ENGINE FOUNDATION/SMALL EX200-1/CHAINA/', 'SMALL EX200-1', 2500, 1700, 1700, 0, 0, 0, 186, 4, 109, 2, NULL, NULL, '2024-07-14 08:06:34', '2024-09-03 08:57:13', 1700),
(187, 3, 'ENGINE FOUNDATION/BIG EX200-1/CHAINA/', 'BIG EX200-1', 3500, 2800, 2800, 0, 0, 0, 187, 4, 109, 2, NULL, NULL, '2024-07-14 08:07:04', '2024-09-03 08:57:13', 2800),
(188, 3, 'SHEET LOCK/EX200-1/CHAINA/S130-V', 'EX200-1', 2500, 1400, 1400, 0, 0, 0, 188, 3, 109, 1, NULL, NULL, '2024-07-14 08:09:36', '2024-09-03 08:57:13', 1400),
(189, 3, 'LIFTY PUMP/S-130-5/CHAINA/DB-58', 'S-130-5', 3000, 2350, 2350, 0, 0, 0, 189, 1, 109, 1, NULL, NULL, '2024-07-14 08:13:19', '2024-09-03 08:57:13', 2350),
(190, 3, 'LIFTY PUMP/EX200-1/CHAINA/6BD1', 'EX200-1', 3000, 2350, 2350, 0, 0, 0, 190, 4, 109, 2, NULL, NULL, '2024-07-14 08:13:57', '2024-09-03 08:57:13', 2350),
(191, 3, 'FUEL CAP/EX200-1/CHAINA/', 'EX200-1', 1250, 800, 800, 0, 0, 0, 191, 4, 109, 2, NULL, NULL, '2024-07-14 08:15:19', '2024-09-03 08:57:13', 800),
(192, 3, 'RACE CABLE/GEAR EX200-1/CHAINA/', 'GEAR EX200-1', 3000, 2000, 2000, 0, 0, 0, 192, 4, 109, 2, NULL, NULL, '2024-07-14 08:16:03', '2024-09-03 08:57:13', 2000),
(193, 3, 'FUEL FILTER/DX-140/DOOSAN CHAINA/K1006520', 'DX-140', 3500, 2200, 2200, 0, 0, 3500, 193, 3, 115, 1, NULL, NULL, '2024-07-14 08:17:15', '2024-09-03 08:57:13', 2200),
(194, 3, 'PISTON SHOE SWING/M2X63/HANDOK/30458', 'M2X63', 18000, 17000, 17000, 0, 0, 0, 194, 1, 97, 1, NULL, NULL, '2024-07-14 08:27:57', '2024-09-03 08:59:53', 17000),
(195, 3, 'AIR FILTER/S-130-5/LOCAL/AF-4838', 'S-130-5', 3400, 2900, 2900, 0, 0, 3400, 195, 1, 103, 1, NULL, NULL, '2024-07-14 08:30:15', '2024-09-10 06:20:02', 2900),
(196, 3, 'OIL FILTER/S-130-5/LOCAL/AMC 3349', 'S-130-5', 650, 575, 575, 0, 0, 650, 196, 2, 103, 1, NULL, NULL, '2024-07-14 08:31:49', '2024-09-10 06:20:02', 575),
(197, 3, 'FUEL FILTER/S-130-5/LOCAL/AMC 185', 'S-130-5', 650, 575, 575, 0, 0, 650, 197, 1, 103, 1, NULL, NULL, '2024-07-14 08:32:40', '2024-09-10 06:20:02', 575),
(198, 3, 'OIL FILTER/DX-140/DOOSAN LOCAL/400508-00036', 'DX-140', 1500, 1200, 1200, 0, 0, 1700, 198, 3, 116, 1, NULL, NULL, '2024-07-14 08:34:34', '2024-09-14 10:29:34', 1200),
(199, 3, 'FUEL FILTER/DX-140/DOOSAN LOCAL/400403-00126', 'DX-140', 1250, 900, 900, 0, 0, 1300, 199, 3, 116, 1, NULL, NULL, '2024-07-14 08:36:07', '2024-09-14 10:29:34', 900),
(200, 3, 'PILOT FILTER/EX200-1/LOCAL/AMC 0707', 'EX200-1', 60, 400, 400, 0, 0, 0, 200, 4, 103, 2, NULL, NULL, '2024-07-14 08:37:34', '2024-09-03 09:47:02', 410.44932079415),
(201, 3, 'OIL FILTER/EX200-1/LOCAL/AMC 1780', 'EX200-1', 750, 600, 600, 0, 0, 850, 201, 4, 103, 2, NULL, NULL, '2024-07-14 08:38:58', '2024-10-20 10:35:47', 600),
(202, 3, 'FUEL FILTER/EX200-1/LOCAL/AMC 2N10', 'EX200-1', 650, 425, 425, 0, 0, 600, 202, 4, 103, 2, NULL, NULL, '2024-07-14 08:39:31', '2024-10-20 10:35:47', 420.72038846887),
(203, 3, 'SUCTION FILTER/EX200-1/LOCAL/EXCELLENT', 'EX200-1', 1500, 1150, 1150, 0, 0, 0, 203, 4, 103, 2, NULL, NULL, '2024-07-14 08:40:43', '2024-09-03 09:47:02', 1180.0417972832),
(204, 3, 'AIR FILTER/EX200-1/LOCAL/AMC 4567', 'EX200-1', 2000, 1400, 1400, 0, 0, 0, 204, 4, 103, 2, NULL, NULL, '2024-07-14 08:41:22', '2024-09-03 09:47:02', 1436.5726227795),
(205, 3, 'SUCTION FILTER/S-130-5/LOCAL/EXCELLENT', 'S-130-5', 1150, 1150, 1150, 0, 0, 2000, 205, 9, 103, 1, NULL, NULL, '2024-07-14 08:42:06', '2024-10-12 13:43:55', 1150),
(206, 3, 'BRAKE STEERING PUMP/H5V80/HANDOK/', 'H5V80', 43500, 42500, 42500, 0, 0, 45500, 206, 2, 97, 1, NULL, NULL, '2024-07-14 08:44:42', '2024-09-04 13:24:37', NULL),
(207, 3, 'PUMP KIT/H3V112/NOK CHAINA/', 'H3V112', 3000, 1850, 1850, 0, 0, 3000, 207, 10, 117, 1, NULL, NULL, '2024-07-14 09:57:46', '2024-10-28 11:34:30', 1850),
(208, 3, 'PUMP KIT/H5V80/NOK CHAINA/', 'H5V80', 2500, 1400, 1400, 0, 0, 2500, 208, 2, 117, 1, NULL, NULL, '2024-07-14 09:58:35', '2024-10-28 11:34:30', 1400),
(209, 3, 'SWING MOTOR KIT/TSM72/NOK CHAINA/', 'TSM72', 1850, 1300, 1300, 0, 0, 2000, 209, 3, 117, 1, NULL, NULL, '2024-07-14 09:59:55', '2024-10-21 12:49:06', 1300),
(210, 3, 'SWING MOTOR KIT/M2X63/DONGBU/', 'M2X63', 1700, 1200, 1200, 0, 0, 2000, 210, 2, 100, 1, NULL, NULL, '2024-07-14 10:00:54', '2024-10-15 12:20:50', 1200),
(211, 3, 'SWING MOTOR KIT/BIG MX173/NOK CHAINA/', 'BIG MX173', 2000, 1500, 1500, 0, 0, 0, 211, 4, 117, 2, NULL, NULL, '2024-07-14 10:01:47', '2024-09-03 10:07:42', 1500),
(212, 3, 'PUMP KIT/A8V86/DONGBU/', 'A8V86', 2000, 1000, 1000, 0, 0, 2000, 212, 9, 100, 1, NULL, NULL, '2024-07-14 10:02:27', '2024-09-30 12:58:43', 1000),
(213, 3, 'AIR FILTER/DX-140/LOCAL/', 'DX-140', 3500, 2800, 2800, 0, 0, 3500, 213, 3, 103, 1, NULL, NULL, '2024-07-14 10:03:32', '2024-09-03 10:24:31', 2800),
(214, 3, 'PILOT FILTER/S-130-5/LOCAL/', 'S-130-5', 450, 250, 250, 0, 0, 500, 214, 9, 103, 1, NULL, NULL, '2024-07-14 10:04:31', '2024-10-15 12:20:50', 250),
(215, 3, 'BRAKE FILTER/S-130-5/LOCAL/', 'S-130-5', 450, 350, 350, 0, 0, 0, 215, 9, 103, 1, NULL, NULL, '2024-07-14 10:05:24', '2024-09-03 10:24:31', 350),
(216, 3, 'T/M LEATHER PLATE/BIG S130-5/LOCAL/', 'BIG S130-5', 1150, 750, 750, 0, 0, 0, 216, 3, 103, 1, NULL, NULL, '2024-07-14 10:09:40', '2024-09-03 11:44:02', 750),
(217, 3, 'T/M STEEL PLATE/BIG S130-5/CHAINA/', 'BIG S130-5', 850, 550, 550, 0, 0, 750, 217, 3, 109, 1, NULL, NULL, '2024-07-14 10:11:31', '2024-07-22 09:44:16', 0),
(218, 3, 'T/M LEATHER PLATE/SMALL S130-5/CHAINA/', 'SMALL S130-5', 550, 300, 300, 0, 0, 350, 218, 1, 109, 1, NULL, NULL, '2024-07-14 10:12:53', '2024-09-04 13:18:47', 300),
(219, 3, 'T/M STEEL PLATE/SMALL S130-5/CHAINA/', 'SMALL S130-5', 300, 200, 200, 0, 0, 260, 219, 2, 109, 1, NULL, NULL, '2024-07-14 10:14:08', '2024-09-10 07:54:51', 200),
(220, 3, 'O-RING/GREEN BOX/CHAINA/', 'GREEN BOX', 2500, 1300, 1300, 0, 0, 0, 220, 5, 109, NULL, NULL, NULL, '2024-07-14 10:15:37', '2024-09-04 05:46:38', 1300),
(221, 3, 'WHEEL GEAR/S/L DX-140/CHAINA/', 'S/L DX-140', 2500, 1400, 1400, 0, 0, 2500, 221, 3, 109, 1, NULL, NULL, '2024-07-15 16:44:46', '2024-09-22 06:11:46', 1400),
(222, 3, 'WHEEL GEAR/S-130-5/CHAINA/', 'S-130-5', 2500, 500, 500, 0, 0, 0, 222, 1, 109, 1, NULL, NULL, '2024-07-15 16:45:13', '2024-09-05 08:00:41', 1175),
(223, 3, 'AIR FILTER/EX200-1/DOOSAN LOCAL/', 'EX200-1', 2000, 1350, 1350, 0, 0, 2000, 223, 4, 116, 2, NULL, NULL, '2024-07-15 17:17:05', '2024-09-10 13:09:05', 1350),
(224, 3, 'CUP BUSH/65*30/CHAINA/', '65*30', 550, 370, 370, 0, 0, 500, 224, 5, 109, NULL, NULL, NULL, '2024-07-15 17:33:44', '2024-10-27 06:43:04', 370),
(225, 3, 'GUIDE SPACER/SG-04/HANDOK/', 'SG-04', 2500, 1500, 1500, 0, 0, 2500, 225, 11, 97, 1, NULL, NULL, '2024-07-15 17:35:23', '2024-09-04 13:38:58', NULL),
(226, 3, 'STEARING JACK KIT/S-130-5/BT KOREA/', 'S-130-5', 1500, 1000, 1000, 0, 0, 1500, 226, 1, 96, 1, NULL, NULL, '2024-07-16 10:29:50', '2024-09-22 06:39:15', 1000),
(227, 3, 'SHIKANJA KIT/35MM S130-5/DONGBU/', '35MM S130-5', 1500, 750, 750, 0, 0, 1000, 227, 1, 100, 1, NULL, NULL, '2024-07-16 10:42:59', '2024-10-13 12:48:35', 750),
(228, 3, 'COIL/13MM S130-5/CHAINA/', '13MM S130-5', 2000, 1380, 1380, 0, 0, 0, 228, 2, 109, 1, NULL, NULL, '2024-07-16 10:44:11', '2024-09-04 06:54:20', 1380),
(229, 3, 'COIL/16MM DX-140/CHAINA/', '16MM DX-140', 2500, 1750, 1750, 0, 0, 0, 229, 3, 109, 1, NULL, NULL, '2024-07-16 10:44:53', '2024-09-04 06:54:20', 1750),
(230, 3, 'T/M SEAL KIT/DX-140/BT KOREA CHN/', 'DX-140', 8500, 6250, 6250, 0, 0, 0, 230, 3, 99, 1, NULL, NULL, '2024-07-16 10:45:58', '2024-09-04 07:09:08', 6250),
(231, 3, 'T/M SEAL KIT/S-130-5/BT KOREA CHN/', 'S-130-5', 8500, 6250, 6250, 0, 0, 8000, 231, 1, 99, 1, NULL, NULL, '2024-07-16 10:46:21', '2024-09-30 13:03:05', NULL),
(232, 3, 'PUMP KIT/DX-140/DONGBU/', 'DX-140', 2500, 1500, 1500, 0, 0, 2300, 232, 3, 100, 1, NULL, NULL, '2024-07-16 10:47:01', '2024-09-04 07:09:08', 1500),
(233, 3, 'GEAR PUMP/EX200-1/BOILLET/', 'EX200-1', 25000, 21000, 21000, 0, 0, 26000, 233, 4, 118, 2, NULL, NULL, '2024-07-16 10:49:03', '2024-10-09 12:47:58', 21083.333333333),
(234, 3, 'GEAR PUMP/S-130-5/BOILLET/H3V63', 'S-130-5', 25500, 22000, 22000, 0, 0, 26500, 234, 1, 118, 1, NULL, NULL, '2024-07-16 10:49:40', '2024-09-25 06:38:26', 22000),
(235, 3, 'GEAR PUMP/A8V86/YYG/', 'A8V86', 32000, 23000, 23000, 0, 0, 24000, 235, 9, 119, 1, NULL, NULL, '2024-07-16 10:52:27', '2024-09-19 06:01:06', 23000),
(236, 3, 'GEAR PUMP/A8V080/YYG/', 'A8V080', 35000, 30000, 30000, 0, 0, 36000, 236, 3, 119, 1, NULL, NULL, '2024-07-16 10:52:55', '2024-09-04 07:16:51', 30000),
(237, 3, 'ARM KIT/S-130-5/DONGBU/', 'S-130-5', 2500, 1650, 1650, 0, 0, 1800, 237, 1, 100, 1, NULL, NULL, '2024-07-16 10:56:38', '2024-10-24 09:45:22', 1650),
(238, 3, 'BOOM KIT/S-130-5/DONGBU/', 'S-130-5', 2500, 1800, 1800, 0, 0, 2500, 238, 1, 100, 1, NULL, NULL, '2024-07-16 10:56:59', '2024-10-21 12:56:01', 1800),
(239, 3, 'BUCKET KIT/S-130-5/DONGBU/', 'S-130-5', 2500, 1800, 1800, 0, 0, 2500, 239, 1, 100, 1, NULL, NULL, '2024-07-16 10:57:23', '2024-10-12 13:53:50', NULL),
(240, 3, 'T/M SEAL KIT/S-130-5/BT KOREA/', 'S-130-5', 13000, 8300, 8300, 0, 0, 0, 240, 1, 96, 1, NULL, NULL, '2024-07-16 12:34:13', '2024-09-04 07:54:00', 8300),
(241, 3, 'CENTRE JOINT KIT/DX-140/BT KOREA/', 'DX-140', 12500, 4500, 4500, 0, 0, 0, 241, 3, 96, 1, NULL, NULL, '2024-07-16 12:47:42', '2024-07-16 12:52:14', 0),
(242, 3, 'SHIKANJA KIT/S140-5/DONGBU/', 'S140-5', NULL, NULL, 0, 0, 0, 0, 242, 2, 100, 1, NULL, NULL, '2024-07-16 13:14:43', '2024-07-16 13:14:43', 0),
(243, 3, 'CUP BUSH/40*30/CHAINA/', '40*30', 400, 300, 300, 0, 0, 500, 243, 2, 109, 1, NULL, NULL, '2024-07-16 13:15:38', '2024-09-10 08:10:32', 300),
(244, 3, 'SHIKANJA KIT/40MM/DONGBU/S130-V', '40MM', 1250, 850, 850, 0, 0, 1000, 244, 2, 100, 1, NULL, NULL, '2024-07-16 13:17:17', '2024-09-22 06:45:34', 850),
(245, 3, 'SUN GEAR/FRONT S130-5/K TOP KOREA/4472 319 157', 'FRONT S130-5', 7000, 6000, 6000, 0, 0, 7000, 245, 1, 120, 1, NULL, NULL, '2024-07-17 08:47:10', '2024-09-07 04:52:45', NULL),
(246, 3, 'ARM PIN/71*19 S130-5/CHAINA/', '71*19 S130-5', 10500, 9500, 9500, 0, 0, 11000, 246, 2, 109, 1, NULL, NULL, '2024-07-17 08:54:51', '2024-09-07 05:14:46', NULL),
(247, 3, 'PIN BUSH/71*86*80/CHAINA/', '71*86*80', 1250, 1000, 1000, 0, 0, 1300, 247, 2, 109, 1, NULL, NULL, '2024-07-17 09:01:41', '2024-09-07 05:14:46', NULL),
(248, 3, 'PIN/71*9/CHAINA/', '71*9', 7500, 6500, 6500, 0, 0, 0, 248, 3, 109, 1, NULL, NULL, '2024-07-17 09:02:51', '2024-09-04 08:13:52', 6500),
(249, 3, 'SHIKANJA KIT/35MM S-130-5/BT KOREA/', '35MM S-130-5', 2500, 1100, 1100, 0, 0, 0, 249, 2, 96, 1, NULL, NULL, '2024-07-17 09:08:16', '2024-07-17 09:13:34', 0),
(250, 3, 'AIR FILTER/S-130-5/WILSON/', 'S-130-5', 6500, 5500, 5500, 0, 0, 5500, 250, 1, 104, 1, NULL, NULL, '2024-07-17 09:10:12', '2024-09-22 06:45:34', 5500),
(251, 3, 'PIN BUSH/65*80*65/CHAINA/', '65*80*65', 850, 750, 750, 0, 0, 900, 251, 2, 109, 1, NULL, NULL, '2024-07-17 09:11:26', '2024-09-11 05:36:51', 750),
(252, 3, 'PIN BUSH/71*86*90/CHAINA/', '71*86*90', NULL, 1000, 1000, 0, 0, 1300, 252, 3, 109, 1, NULL, NULL, '2024-07-18 10:51:50', '2024-09-07 13:22:33', NULL),
(253, 3, 'BUCKET TEETH/S-225/CHAINA/', 'S-225', 4000, 3700, 3700, 0, 0, 4200, 253, 10, 109, 1, NULL, NULL, '2024-07-18 10:58:09', '2024-09-07 13:29:47', NULL),
(254, 3, 'BUCKET ADAPTER/S-225/CHAINA/', 'S-225', 3200, 5600, 5600, 0, 0, 6600, 254, 10, 109, 1, NULL, NULL, '2024-07-18 10:58:46', '2024-09-07 13:29:47', NULL),
(255, 3, 'BUCKET SIDE CUTTER/S-225/CHAINA/', 'S-225', 5500, 5000, 5000, 0, 0, 6250, 255, 10, 109, 1, NULL, NULL, '2024-07-18 10:59:34', '2024-09-07 13:29:47', NULL),
(256, 3, 'TEETH PIN&WASHEL/S-225/CHAINA/', 'S-225', 250, 200, 200, 0, 0, 300, 256, 10, 109, 1, NULL, NULL, '2024-07-18 11:00:04', '2024-09-08 05:37:35', NULL),
(257, 3, 'PISTON SHOE PUMP/H3V112/CHAINA/', 'H3V112', 22500, 21000, 21000, 0, 0, 24000, 257, 10, 109, 1, NULL, NULL, '2024-07-18 11:30:01', '2024-09-04 12:57:27', 21000),
(258, 3, 'ARM KIT/FH-200/DONGBU/', 'FH-200', 3000, 2250, 2250, 0, 0, 3500, 258, 12, 100, 2, NULL, NULL, '2024-07-18 11:42:36', '2024-09-10 07:36:48', NULL),
(259, 3, 'BOOM KIT/FH-200/DONGBU/', 'FH-200', 3000, 2250, 2250, 0, 0, 2700, 259, 12, 100, 2, NULL, NULL, '2024-07-18 11:43:14', '2024-09-08 05:33:23', NULL),
(260, 3, 'BUCKET KIT/FH-200/DONGBU/', 'FH-200', 3000, 2250, 2250, 0, 0, 2600, 260, 12, 100, 2, NULL, NULL, '2024-07-18 11:44:02', '2024-09-08 05:33:23', NULL),
(261, 3, 'CRAWLING MOTOR KIT/A6V115/DONGBU/', 'A6V115', 1500, 1200, 1200, 0, 0, 2000, 261, 9, 100, 1, NULL, NULL, '2024-07-18 11:45:56', '2024-10-10 14:25:23', NULL),
(262, 3, 'GODA BERING/804846/TIMKEN/', '804846', 2500, 2000, 2000, 0, 0, 2500, 262, 1, 121, 1, NULL, NULL, '2024-07-18 11:56:51', '2024-09-10 06:46:05', NULL),
(263, 3, 'SEAL/AP-3055/CHAINA/', 'AP-3055', 500, 360, 360, 0, 0, 0, 263, 4, 109, 1, NULL, NULL, '2024-07-20 09:37:19', '2024-09-04 07:59:03', 360),
(264, 3, 'SEAL/AW-3055/CHAINA/', 'AW-3055', 1000, 550, 550, 0, 0, 1500, 264, 4, 109, 2, NULL, NULL, '2024-07-20 09:37:44', '2024-09-04 07:59:03', 550),
(265, 3, 'BUCKET TEETH/S-225/CHAINA/BLACK', 'S-225', 3250, 3000, 3000, 0, 0, 3600, 265, 10, 109, 1, NULL, NULL, '2024-07-20 09:47:38', '2024-09-08 05:37:35', NULL),
(266, 3, 'VALVE/3STEP 13MM/CHAINA/S130-V', '3STEP 13MM', 3500, 2700, 2700, 0, 0, 0, 266, 1, 109, 1, NULL, NULL, '2024-07-20 10:02:59', '2024-09-05 04:57:27', 2700),
(267, 3, 'VALVE/2STEP 16MM/CHAINA/DX-140', '2STEP 16MM', 4000, 2500, 2500, 0, 0, 0, 267, 3, 109, 1, NULL, NULL, '2024-07-20 10:03:49', '2024-09-05 04:57:27', 2500),
(268, 3, 'SHIKANJA KIT/45MM S130-5/DONGBU/', '45MM S130-5', 1500, 1000, 1000, 0, 0, 1500, 268, 2, 100, 2, NULL, NULL, '2024-07-20 10:16:15', '2024-09-11 07:09:40', NULL),
(269, 3, 'CUP BUSH/45*30/CHAINA/', '45*30', 500, 300, 300, 0, 0, 500, 269, 2, 109, 1, NULL, NULL, '2024-07-20 10:16:46', '2024-09-10 07:23:34', 300),
(270, 3, 'WHEEL LEATHER PLATE/S-130-5/CHAINA/', 'S-130-5', NULL, 600, 600, 0, 0, 950, 270, 1, 109, 1, NULL, NULL, '2024-07-20 10:21:23', '2024-10-19 11:35:51', 600),
(271, 3, 'ARM KIT/FH-200/BT KOREA/', 'FH-200', 3000, 2250, 2250, 0, 0, 0, 271, 12, 96, 2, NULL, NULL, '2024-07-20 10:27:38', '2024-09-05 05:13:01', 2250),
(272, 3, 'BOOM KIT/FH-200/BT KOREA/', 'FH-200', 3000, 2250, 2250, 0, 0, 0, 272, 12, 96, 2, NULL, NULL, '2024-07-20 10:28:50', '2024-09-05 05:13:01', 2250),
(273, 3, 'BUCKET KIT/FH-200/BT KOREA/', 'FH-200', 3000, 2250, 2250, 0, 0, 0, 273, 12, 96, 2, NULL, NULL, '2024-07-20 10:29:16', '2024-09-05 05:13:01', 2250),
(274, 3, 'WHEEL LEATHER PLATE/DX-140/CHAINA/', 'DX-140', 1700, 1250, 1250, 0, 0, 1500, 274, 3, 109, 1, NULL, NULL, '2024-07-20 10:45:19', '2024-10-02 13:31:12', 1250),
(275, 3, 'WHEEL STEEL PLATE/DX-140/CHAINA/', 'DX-140', 1600, 900, 900, 0, 0, 0, 275, 3, 109, 1, NULL, NULL, '2024-07-20 10:45:57', '2024-09-07 09:05:51', 1122.2222222222),
(276, 3, 'DOZER KIT/S-130-5/DONGBU/', 'S-130-5', 2000, 1650, 1650, 0, 0, 1900, 276, 1, 100, 1, NULL, NULL, '2024-07-20 10:55:22', '2024-09-11 07:35:50', NULL),
(277, 3, 'HUB SEAL/S-130-5/DONGBU/', 'S-130-5', 1500, 900, 900, 0, 0, 2000, 277, 1, 100, 1, NULL, NULL, '2024-07-20 10:55:51', '2024-10-15 11:40:28', 925),
(278, 3, 'BRAKE KIT/S-130-5/DONGBU/', 'S-130-5', 1650, 1600, 1600, 0, 0, 1650, 278, 1, 100, 1, NULL, NULL, '2024-07-20 10:56:15', '2024-09-10 07:05:31', 1600),
(279, 3, 'HUB SEAL/DX-140/DONGBU/', 'DX-140', 1800, 1250, 1250, 0, 0, 1450, 279, 3, 100, 1, NULL, NULL, '2024-07-20 10:56:38', '2024-09-10 07:05:31', NULL),
(280, 3, 'CENTRE JOINT KIT/SMALL C/J S130-3/DONGBU/', 'SMALL C/J S130-3', 3000, 1800, 1800, 0, 0, 2200, 280, 9, 100, 1, NULL, NULL, '2024-07-20 11:02:35', '2024-09-10 07:05:31', NULL),
(281, 3, 'CENTRE JOINT KIT/BIG C/J S130-3/DONGBU/', 'BIG C/J S130-3', 4500, 3000, 3000, 0, 0, 3300, 281, 9, 100, 1, NULL, NULL, '2024-07-20 11:03:28', '2024-09-10 07:05:31', NULL),
(282, 3, 'BRAKE KIT/R-1400/DONGBU/', 'R-1400', 1700, 1500, 1500, 0, 0, 1800, 282, 11, 100, 1, NULL, NULL, '2024-07-20 11:12:39', '2024-09-10 07:05:31', NULL),
(283, 3, 'ARM KIT/S80-2/DONGBU/', 'S80-2', 2500, 1800, 1800, 0, 0, 3500, 283, 13, 100, 1, NULL, NULL, '2024-07-20 11:13:23', '2024-09-10 07:08:02', NULL),
(284, 3, 'BOOM KIT/S80-2/DONGBU/', 'S80-2', 2500, 1800, 1800, 0, 0, 0, 284, 13, 100, 1, NULL, NULL, '2024-07-20 11:13:51', '2024-09-05 07:52:10', 1800),
(285, 3, 'ARM KIT/S-225/DOOSAN KR/', 'S-225', NULL, 500, 500, 0, 0, 0, 285, 10, 122, 1, NULL, NULL, '2024-07-20 11:23:18', '2024-09-05 08:00:41', 500),
(286, 3, 'SEAL/70*90*7/CHAINA/', '70*90*7', NULL, 200, 200, 0, 0, 0, 286, 2, 109, 1, NULL, NULL, '2024-07-20 11:24:56', '2024-09-05 08:00:41', 200),
(287, 3, 'SEAL/80*110*11/CHAINA/', '80*110*11', NULL, 500, 500, 0, 0, 0, 287, 2, 109, 1, NULL, NULL, '2024-07-20 11:25:31', '2024-09-05 08:00:41', 500),
(288, 3, 'ROUTER LIGHT/S-130-5/CHAINA/DX-140', 'S-130-5', 5000, 4000, 4000, 0, 0, 5000, 288, 5, 109, 1, NULL, NULL, '2024-07-20 11:45:05', '2024-09-10 07:17:55', NULL),
(289, 3, 'CUP BUSH/105*30/CHAINA/', '105*30', 1200, 900, 900, 0, 0, 1200, 289, 5, 109, 1, NULL, NULL, '2024-07-20 11:52:35', '2024-09-10 07:50:10', NULL),
(290, 3, 'BELLOW SEAL/318MM/CHAINA/', '318MM', 6000, 5500, 5500, 0, 0, 6500, 290, 12, 109, 2, NULL, NULL, '2024-07-20 11:59:17', '2024-09-10 07:36:48', 5500),
(291, 3, 'CUP BUSH/35*30/CHAINA/', '35*30', 450, 250, 250, 0, 0, 500, 291, 2, 109, 1, NULL, NULL, '2024-07-20 12:03:42', '2024-09-11 09:33:43', 250),
(292, 3, 'HAMMER PIPE VALVE/SB-70/CHAINA/', 'SB-70', NULL, 3500, 3500, 0, 0, 4500, 292, 4, 109, 2, NULL, NULL, '2024-07-20 12:53:34', '2024-09-10 07:36:48', NULL),
(293, 3, 'ENGINE OIL/20W-50/DELO SILVER/', '20W-50', 1050, 950, 950, 0, 0, 1075, 293, 5, 123, NULL, NULL, NULL, '2024-07-20 12:58:38', '2024-09-10 07:29:59', NULL),
(294, 3, 'WEIST COTTON/BAG/LOCAL/', 'BAG', 250, 100, 100, 0, 0, 130, 294, 5, 103, NULL, NULL, NULL, '2024-07-20 13:08:30', '2024-10-20 08:08:14', NULL),
(295, 3, 'AIR FILTER/LLA-257/LOCAL/', 'LLA-257', 3200, 2750, 2750, 0, 0, 4000, 295, 5, 103, NULL, NULL, NULL, '2024-07-20 13:19:13', '2024-09-10 07:29:59', NULL),
(296, 3, 'OIL FILTER/SMO-20/LOCAL/', 'SMO-20', 800, 500, 500, 0, 0, 1500, 296, 5, 103, NULL, NULL, NULL, '2024-07-20 13:20:18', '2024-09-10 07:29:59', NULL),
(297, 3, 'FUEL FILTER/MPF-35829/LOCAL/', 'MPF-35829', 750, 450, 450, 0, 0, 1000, 297, 5, 103, NULL, NULL, NULL, '2024-07-20 13:21:27', '2024-09-10 07:29:59', NULL),
(298, 3, 'AIR CLINDER PIPE/MITSUBISHI/LOCAL/', 'MITSUBISHI', 3500, 2500, 2500, 0, 0, 4000, 298, 5, 103, NULL, NULL, NULL, '2024-07-20 13:26:37', '2024-09-10 07:29:59', NULL),
(299, 3, 'SILICON/85GM/LOCAL/', '85GM', NULL, 230, 230, 0, 0, 500, 299, 5, 103, NULL, NULL, NULL, '2024-07-22 11:02:17', '2024-10-20 08:08:14', 230),
(300, 3, 'SILICON/60GM/LOCAL/', '60GM', NULL, 200, 200, 0, 0, 450, 300, 5, 103, NULL, NULL, NULL, '2024-07-22 11:03:02', '2024-09-11 07:01:43', NULL),
(301, 3, 'SILICON/25GM/LOCAL/', '25GM', NULL, 150, 150, 0, 0, 200, 301, 5, 103, NULL, NULL, NULL, '2024-07-22 11:03:38', '2024-09-30 13:03:05', 150),
(302, 3, 'CRAWLING PLANTRY/EX200-1/QABLI/19 TEETH', 'EX200-1', NULL, 25000, 25000, 0, 0, 32000, 302, 4, 124, 2, NULL, NULL, '2024-07-22 11:07:29', '2024-09-10 08:07:59', NULL),
(303, 3, 'PLANTRY SHAFT/EX200-1/QABLI/14 TEETH', 'EX200-1', NULL, 10000, 10000, 0, 0, 13000, 303, 4, 124, 2, NULL, NULL, '2024-07-22 11:08:36', '2024-09-10 08:07:59', NULL),
(304, 3, 'PISTON SHOE SWING/TSM72/HANDOK/', 'TSM72', NULL, 18000, 18000, 0, 0, 19000, 304, 3, 97, 1, NULL, NULL, '2024-07-22 11:11:23', '2024-09-10 11:00:02', NULL),
(305, 3, 'SWASH PLATE/TSM72/HANDOK/', 'TSM72', NULL, 20000, 20000, 0, 0, 21000, 305, 3, 97, 1, NULL, NULL, '2024-07-22 11:12:12', '2024-09-10 11:00:02', NULL),
(306, 3, 'VALVE PLATE SWING/TSM72/HANDOK/', 'TSM72', 12500, 10500, 10500, 0, 0, 11500, 306, 3, 97, 1, NULL, NULL, '2024-07-22 11:15:25', '2024-10-21 12:49:06', 10500),
(307, 3, 'CENTRE JOINT KIT/EX-100/USA/', 'EX-100', 6500, 5000, 5000, 0, 0, 0, 307, 6, 112, 2, NULL, NULL, '2024-07-22 13:30:23', '2024-09-07 05:27:30', 5000),
(308, 3, 'LEVER UNIT/S-130-5/CHAINA/', 'S-130-5', 18000, 15000, 15000, 0, 0, 0, 308, 3, 109, 1, NULL, NULL, '2024-07-22 13:31:28', '2024-09-07 05:27:30', 15000),
(309, 3, 'AIR CLINDER PIPE/S-130-5/LOCAL/', 'S-130-5', 8500, 7500, 7500, 0, 0, 8500, 309, 2, 103, 1, NULL, NULL, '2024-07-25 13:40:41', '2024-09-10 12:32:56', NULL);
INSERT INTO `machine_part_oem_part_nos_machine_models` (`id`, `user_id`, `name`, `primary_oem`, `sale_price`, `purchase_price`, `purchase_dollar_rate`, `min_price`, `max_price`, `last_sale_price`, `machine_part_oem_part_no_id`, `machine_model_id`, `brand_id`, `origin_id`, `from_year`, `to_year`, `created_at`, `updated_at`, `avg_cost`) VALUES
(310, 3, 'CUP BUSH/60*30/CHAINA/', '60*30', NULL, 350, 350, 0, 0, 500, 310, 5, 109, NULL, NULL, NULL, '2024-07-27 07:58:32', '2024-09-14 10:48:16', NULL),
(311, 3, 'CUP BUSH/95*30/CHAINA/', '95*30', NULL, 500, 500, 0, 0, 1000, 311, 5, 109, NULL, NULL, NULL, '2024-07-27 07:59:15', '2024-09-07 05:33:02', 500),
(312, 3, 'PANA/80MM/LOCAL/', '80MM', NULL, 3000, 3000, 0, 0, 3500, 312, 5, 103, NULL, NULL, NULL, '2024-07-27 08:00:33', '2024-09-10 12:02:58', NULL),
(313, 3, 'AIR FILTER/DX-140/HLX/', 'DX-140', 8000, 6000, 6000, 0, 0, 0, 313, 3, 126, 1, NULL, NULL, '2024-07-28 13:34:14', '2024-09-07 05:48:26', 6000),
(314, 3, 'CRAWLING MOTOR KIT/A6VM107/DONGBU/', 'A6VM107', 2500, 1500, 1500, 0, 0, 0, 314, 3, 100, 1, NULL, NULL, '2024-07-28 13:34:49', '2024-09-07 05:53:28', 1500),
(315, 3, 'PISTON SHOE PUMP/H5V80/MACHINERY/', 'H5V80', 17500, 17000, 17000, 0, 0, 17500, 315, 2, 127, 1, NULL, NULL, '2024-07-28 13:35:41', '2024-09-10 12:54:20', NULL),
(316, 3, 'CRAWLING MOTOR KIT/GM18VL-J/NOK CHAINA/DX-140', 'GM18VL-J', 3500, 2250, 2250, 0, 0, 3500, 316, 3, 117, 1, NULL, NULL, '2024-07-28 13:37:07', '2024-09-10 13:06:01', NULL),
(321, 3, 'PILOT PUMP KIT/UHO7-7/DONGBU/', 'UHO7-7', 2500, 1000, 1000, 0, 0, 2500, 321, 19, 100, 2, NULL, NULL, '2024-08-03 09:17:36', '2024-09-10 13:24:37', NULL),
(322, 3, 'BOOM KIT/S-225/DONGBU/', 'S-225', 3000, 2200, 2200, 0, 0, 0, 322, 10, 100, 1, NULL, NULL, '2024-08-03 09:39:16', '2024-09-07 06:22:19', 2200),
(323, 3, 'BOOM KIT/DX-225/DONGBU/', 'DX-225', 3000, 2500, 2500, 0, 0, 0, 323, 20, 100, 1, NULL, NULL, '2024-08-03 09:40:22', '2024-09-07 06:22:19', 2500),
(324, 3, 'CYLINDER BLOCK/M2X63/HANDOK/', 'M2X63', 23500, 21000, 21000, 0, 0, 22500, 324, 1, 97, 1, NULL, NULL, '2024-08-03 09:41:03', '2024-10-15 12:20:50', NULL),
(325, 3, 'ARM KIT/DX-225/NOK CHAINA/', 'DX-225', 3000, 2750, 2750, 0, 0, 4000, 325, 20, 117, 1, NULL, NULL, '2024-08-05 07:02:35', '2024-09-07 08:10:54', 2750),
(326, 3, 'BOOM KIT/DX-225/NOK CHAINA/', 'DX-225', NULL, NULL, 0, 0, 0, 0, 326, 20, 117, 1, NULL, NULL, '2024-08-05 07:03:01', '2024-08-05 07:03:01', 0),
(327, 3, 'BUCKET KIT/DX-225/NOK CHAINA/', 'DX-225', 3000, 2750, 2750, 0, 0, 0, 327, 20, 117, 1, NULL, NULL, '2024-08-05 07:03:37', '2024-09-07 08:10:54', 2750),
(328, 3, 'PUMP KIT/H3V112/NOK LOCAL/', 'H3V112', 2500, 1500, 1500, 0, 0, 2500, 328, 10, 136, 1, NULL, NULL, '2024-08-05 07:04:27', '2024-09-11 05:11:45', NULL),
(329, 3, 'GEAR PUMP/H3V112/HANDOK/4B', 'H3V112', NULL, NULL, 0, 0, 0, 0, 329, 10, 97, 1, NULL, NULL, '2024-08-05 07:05:02', '2024-08-05 07:05:02', 0),
(330, 3, 'GODA SEAL/S-130-5/DONGBU/', 'S-130-5', 1000, 600, 600, 0, 0, 900, 330, 2, 100, 1, NULL, NULL, '2024-08-05 07:16:04', '2024-10-10 14:22:52', NULL),
(331, 3, 'CHAIN ADJUSTER KIT/EX200-5/CHAINA/', 'EX200-5', 1350, 550, 550, 0, 0, 1250, 331, 22, 109, 2, NULL, NULL, '2024-08-05 09:33:11', '2024-09-11 05:20:16', 475),
(332, 3, 'LEVER CROSS/S-130-5/CHAINA/', 'S-130-5', NULL, 700, 700, 0, 0, 0, 332, 1, 109, 1, NULL, NULL, '2024-08-05 09:35:08', '2024-09-07 09:03:48', 700),
(333, 6, 'Oil Filter/11N8-70110-AS/FleetGuard/LF3970', '11N8-70110-AS', 900, 500, 500, 0, 0, 900, 333, 21, 137, 9, '2020', '2024', '2024-08-06 06:27:36', '2024-08-13 06:57:57', 0),
(334, 6, 'Oil Filter/11N8-70110-AS/FleetGuard/LF3970', '11N8-70110-AS', NULL, NULL, 0, 0, 0, 0, 334, 21, 138, 9, '2020', '2023', '2024-08-06 07:10:46', '2024-08-06 07:10:46', 0),
(335, 3, 'O-RING/120-3/LOCAL/', '120-3', 150, 50, 50, 0, 0, 350, 335, 5, 103, NULL, NULL, NULL, '2024-08-07 05:08:40', '2024-09-11 06:24:51', 50),
(336, 3, 'PUMP KIT/H3V63/NOK CHAINA/', 'H3V63', 2500, 1400, 1400, 0, 0, 2000, 336, 1, 117, 1, NULL, NULL, '2024-08-07 05:09:35', '2024-09-30 13:04:14', NULL),
(337, 3, 'CRAWLING MOTOR KIT/A6V115/NOK CHAINA/', 'A6V115', 2500, 1000, 1000, 0, 0, 0, 337, 2, 117, 1, NULL, NULL, '2024-08-07 05:10:16', '2024-09-07 09:40:58', 1000),
(338, 3, 'CRAWLING MOTOR KIT/A6VM107/NOK CHAINA/', 'A6VM107', 2500, 1000, 1000, 0, 0, 0, 338, 3, 117, 1, NULL, NULL, '2024-08-07 05:10:49', '2024-09-07 09:40:58', 1000),
(339, 3, 'PISTON SHOE PUMP/H5V80/HD CHAINA/', 'H5V80', 18000, 16000, 16000, 0, 0, 17500, 339, 2, 141, 1, NULL, NULL, '2024-08-07 06:17:10', '2024-09-11 07:26:03', NULL),
(340, 3, 'GEAR PUMP/H3V112/BOILLET/', 'H3V112', 27500, 22500, 22500, 0, 0, 0, 340, 10, 118, 1, NULL, NULL, '2024-08-07 06:18:00', '2024-09-07 09:45:35', 22500),
(341, 3, 'HAMMER NUT/75MM/QABLI/', '75MM', NULL, 900, 900, 0, 0, 1250, 341, 5, 124, NULL, NULL, NULL, '2024-08-07 06:37:18', '2024-09-11 06:30:25', NULL),
(342, 3, 'DRIVE SHAFT LONG/H5V80/HANDOK/', 'H5V80', 9000, 8000, 8000, 0, 0, 0, 342, 1, 97, 1, NULL, NULL, '2024-08-07 09:45:37', '2024-09-07 09:50:35', 8000),
(343, 3, 'DRIVE SHAFT SHORT/H5V80/HANDOK/', 'H5V80', 8000, 7000, 7000, 0, 0, 0, 343, 1, 97, 1, NULL, NULL, '2024-08-07 09:46:17', '2024-09-07 09:50:35', 7000),
(344, 3, 'SUN GEAR/FRONT S130-5/BT KOREA/', 'FRONT S130-5', 8500, 4500, 4500, 0, 0, 0, 344, 1, 96, 1, NULL, NULL, '2024-08-07 09:46:56', '2024-09-07 09:50:35', 4500),
(345, 3, 'JACK HAMMER KIT/SB-70/YYG/', 'SB-70', 10000, 8000, 8000, 0, 0, 10000, 345, 5, 119, NULL, NULL, NULL, '2024-08-07 09:55:27', '2024-09-11 06:30:24', NULL),
(346, 3, 'BRAKE PEDAL KIT/S-130-5/DONGBU/', 'S-130-5', 1000, 400, 400, 0, 0, 1000, 346, 1, 100, 1, NULL, NULL, '2024-08-07 10:36:27', '2024-10-16 12:13:52', 425),
(347, 3, 'PISTON PATTI/RANDOM JACK/CHAINA/', 'RANDOM JACK', NULL, NULL, 0, 0, 0, 0, 347, 5, 109, NULL, NULL, NULL, '2024-08-07 10:44:19', '2024-08-07 10:45:05', 0),
(348, 3, 'PISTON SHOE PUMP/HPV116/HANDOK/', 'HPV116', 27000, 26000, 26000, 0, 0, 27000, 348, 1, 97, 1, NULL, NULL, '2024-08-07 12:38:04', '2024-09-11 06:24:50', NULL),
(349, 3, 'DRIVE SHAFT/HPV116/HANDOK/', 'HPV116', 46000, 45000, 45000, 0, 0, 47000, 349, 4, 97, 2, NULL, NULL, '2024-08-07 12:39:34', '2024-09-11 06:24:50', NULL),
(350, 3, 'BOOM KIT/S-130-3/DONGBU/', 'S-130-3', 2500, 1650, 1650, 0, 0, 0, 350, 1, 100, 1, NULL, NULL, '2024-08-07 12:44:27', '2024-08-07 12:45:57', 0),
(351, NULL, '/Water Jacket Local//', 'Water Jacket Local', NULL, NULL, 0, 0, 0, 0, 351, 125, 34, 3, NULL, NULL, '2024-08-07 12:44:56', '2024-08-07 12:44:56', 0),
(352, 3, 'VALVE PLATE SWING/TSM72/KIK/', 'TSM72', 11000, 9600, 9600, 0, 0, 11000, 352, 3, 108, 1, NULL, NULL, '2024-08-07 12:47:31', '2024-09-23 13:23:58', NULL),
(353, 3, 'CYLINDER BLOCK/M2X63/KIK/K-TYPE', 'M2X63', 22000, 19500, 19500, 0, 0, 0, 353, 1, 108, 1, NULL, NULL, '2024-08-07 12:48:55', '2024-09-07 09:56:17', 19500),
(354, 3, 'PUMP LOCK/HPV116/LOCAL/', 'HPV116', 150, 10, 10, 0, 0, 100, 354, 4, 103, 2, NULL, NULL, '2024-08-07 12:53:44', '2024-09-14 11:43:19', 10),
(355, 3, 'BOLT OF V-PLATE/HPV116/HANDOK/', 'HPV116', 800, 650, 650, 0, 0, 850, 355, 4, 97, 2, NULL, NULL, '2024-08-07 12:56:53', '2024-09-11 06:24:50', NULL),
(356, 3, 'CHECK NUT/HPV116/HANDOK/', 'HPV116', 6500, 6000, 6000, 0, 0, 6700, 356, 4, 97, 2, NULL, NULL, '2024-08-07 13:04:19', '2024-09-11 06:24:51', NULL),
(357, 3, 'SET PLATE PUMP/A8V55/HANDOK/', 'A8V55', NULL, 3000, 3000, 0, 0, 4000, 357, 6, 97, 2, NULL, NULL, '2024-08-07 13:50:37', '2024-09-07 12:43:43', 3000),
(358, 3, 'VALVE PLATE SWING/M2X-210/HANDOK/', 'M2X-210', NULL, 16000, 16000, 0, 0, 17500, 358, 23, 97, 1, NULL, NULL, '2024-08-08 10:34:05', '2024-09-11 06:45:26', NULL),
(359, 3, 'REGULATOR/H5V80/CHAINA/', 'H5V80', 38000, 27500, 27500, 0, 0, 40000, 359, 1, 109, 1, NULL, NULL, '2024-08-08 10:57:00', '2024-09-14 13:16:05', NULL),
(360, 3, 'MEGIC/UNIVERSAL/LOCAL/', 'UNIVERSAL', 150, 100, 100, 0, 0, 150, 360, 5, 103, NULL, NULL, NULL, '2024-08-11 07:00:54', '2024-10-19 11:35:51', NULL),
(361, 3, 'GEAR OIL/UNIVERSAL/DELO/', 'UNIVERSAL', 1250, 1050, 1050, 0, 0, 1250, 361, 5, 142, NULL, NULL, NULL, '2024-08-11 07:02:58', '2024-09-11 07:01:43', NULL),
(362, 3, 'BOOM KIT/S-170/DONGBU/', 'S-170', 3500, 2800, 2800, 0, 0, 3500, 362, 24, 100, 2, NULL, NULL, '2024-08-11 13:40:10', '2024-09-11 07:13:18', NULL),
(363, 3, 'CUP BUSH/85*40/CHAINA/', '85*40', 1000, 550, 550, 0, 0, 1000, 363, 5, 109, NULL, NULL, NULL, '2024-08-11 13:41:14', '2024-09-11 07:13:18', NULL),
(364, 6, 'Head Light Right/HAV2399/denso/', 'HAV2399', 600, 500, 500, 0, 0, 600, 364, 21, 143, NULL, NULL, NULL, '2024-08-12 09:48:16', '2024-08-13 05:52:17', 0),
(365, 3, 'CYLINDER BLOCK/TSM72/RKS/', 'TSM72', 32000, 24500, 24500, 0, 0, 29000, 365, 3, 144, NULL, NULL, NULL, '2024-08-17 10:49:44', '2024-09-23 14:35:36', NULL),
(366, 3, 'PUMP KIT/H3V112/NOK KOREA/', 'H3V112', 5000, 4000, 4000, 0, 0, 5000, 366, 10, 145, 1, NULL, NULL, '2024-08-17 10:52:58', '2024-09-11 09:27:45', NULL),
(367, 3, 'WHEEL STEEL PLATE/S-130-5/CHAINA/', 'S-130-5', NULL, 550, 550, 0, 0, 750, 382, 2, 109, 1, NULL, NULL, '2024-09-03 07:57:53', '2024-09-10 06:46:05', 550),
(368, 3, 'WHEEL STEEL PLATE/S-130-5/CHAINA/', 'S-130-5', NULL, NULL, 0, 0, 0, 0, 383, 9, 109, 1, NULL, NULL, '2024-09-03 11:35:18', '2024-09-03 11:35:18', 0),
(369, 3, 'PUMP KIT/EX200-1/NOK CHAINA/', 'EX200-1', NULL, 610, 610, 0, 0, 0, 384, 4, 117, 2, NULL, NULL, '2024-09-04 08:03:06', '2024-09-04 08:04:29', 610),
(370, 3, 'GODA SEAL/BIG EW-130/BT KOREA/', 'BIG EW-130', NULL, 350, 350, 0, 0, 0, 385, 7, 96, 1, NULL, NULL, '2024-09-07 13:05:39', '2024-09-07 13:14:36', 350),
(371, 3, 'GODA SEAL/SMALL EW-130/BT KOREA/', 'SMALL EW-130', NULL, 350, 350, 0, 0, 0, 386, 7, 96, 1, NULL, NULL, '2024-09-07 13:06:26', '2024-09-07 13:14:36', 350),
(372, 3, 'BRAKE KIT/R-1400/BT KOREA/', 'R-1400', NULL, 1650, 1650, 0, 0, 4500, 387, 11, 96, 1, NULL, NULL, '2024-09-07 13:12:34', '2024-10-02 13:29:37', 1650),
(373, 3, 'GODA SEAL/EW-170/CHAINA/55*72*12', 'EW-170', NULL, 300, 300, 0, 0, 1500, 388, 29, 109, 1, NULL, NULL, '2024-09-08 05:40:56', '2024-09-11 09:27:45', NULL),
(374, 3, 'OUTER DRUM/EW-170/LOCAL/', 'EW-170', NULL, 32000, 32000, 0, 0, 54000, 389, 29, 103, 1, NULL, NULL, '2024-09-08 05:45:27', '2024-09-11 09:27:45', NULL),
(375, 3, 'HUB SEAL/EW-170/DONGBU/140*170*14.5', 'EW-170', NULL, 1300, 1300, 0, 0, 3000, 390, 29, 100, 1, NULL, NULL, '2024-09-09 11:50:03', '2024-09-11 09:27:45', NULL),
(376, 3, 'BRAKE KIT/EW-170/DONGBU/', 'EW-170', NULL, 375, 375, 0, 0, 1000, 391, 29, 100, 1, NULL, NULL, '2024-09-09 11:50:38', '2024-09-11 09:27:45', NULL),
(377, 3, 'STEARING JACK KIT/EW-170/DONGBU/', 'EW-170', NULL, 2850, 2850, 0, 0, 4500, 392, 29, 100, 1, NULL, NULL, '2024-09-09 11:51:12', '2024-09-11 09:27:45', NULL),
(378, 3, 'BUCKET KIT/EW-170/DONGBU/', 'EW-170', NULL, 2250, 2250, 0, 0, 4000, 393, 29, 100, 1, NULL, NULL, '2024-09-09 11:51:48', '2024-09-11 09:27:45', NULL),
(379, 3, 'CUP BUSH/70*40/CHAINA/', '70*40', NULL, 500, 500, 0, 0, 1000, 394, 29, 109, 1, NULL, NULL, '2024-09-09 11:52:30', '2024-09-11 09:27:45', NULL),
(380, 3, 'GEAR PIN/PL-1 OLD MODEL/CHAINA/S130-3', 'PL-1 OLD MODEL', NULL, 1400, 1400, 0, 0, 1850, 395, 9, 109, 1, NULL, NULL, '2024-09-09 12:00:23', '2024-09-11 07:30:32', NULL),
(381, 3, 'WHEEL BOLT/EW-170/CHAINA/DX-140', 'EW-170', NULL, 600, 600, 0, 0, 1250, 396, 29, 109, 1, NULL, NULL, '2024-09-09 12:21:15', '2024-09-11 09:27:45', NULL),
(382, 3, 'CYLINDER BLOCK/TSM72/QABLI/', 'TSM72', NULL, 19500, 19500, 0, 0, 0, 397, 3, 124, 1, NULL, NULL, '2024-09-09 12:28:26', '2024-09-09 12:56:50', 19500),
(384, 3, 'PISTON SHOE SWING/TSM72/QABLI/', 'TSM72', NULL, 14500, 14500, 0, 0, 0, 399, 3, 124, 1, NULL, NULL, '2024-09-09 12:30:58', '2024-09-09 12:56:50', 14500),
(385, 3, 'VALVE PLATE SWING/TSM72/QABLI/', 'TSM72', NULL, 7500, 7500, 0, 0, 0, 400, 3, 124, 1, NULL, NULL, '2024-09-09 12:31:41', '2024-09-09 12:56:50', 7500),
(386, 3, 'SWASH PLATE/TSM72/QABLI/', 'TSM72', NULL, 16000, 16000, 0, 0, 0, 401, 3, 124, 1, NULL, NULL, '2024-09-09 12:32:11', '2024-09-09 12:56:50', 16000),
(387, 3, 'ROTOR PIN/TSM72/QABLI/', 'TSM72', NULL, 100, 100, 0, 0, 0, 402, 3, 124, 1, NULL, NULL, '2024-09-09 12:33:37', '2024-09-09 12:56:50', 100),
(388, 3, 'COIL SPRING/TSM72/QABLI/', 'TSM72', NULL, 1200, 1200, 0, 0, 0, 403, 3, 124, 1, NULL, NULL, '2024-09-09 12:34:21', '2024-09-09 12:56:50', 1200),
(389, 3, 'ROTOR SPRING LOCK/TSM72/QABLI/', 'TSM72', NULL, 300, 300, 0, 0, 0, 404, 3, 124, 1, NULL, NULL, '2024-09-09 12:35:21', '2024-09-09 12:56:50', 300),
(390, 3, 'BALL GUIDE/TSM72/QABLI/', 'TSM72', NULL, 1500, 1500, 0, 0, 0, 405, 3, 124, 1, NULL, NULL, '2024-09-09 12:35:48', '2024-09-09 12:56:50', 1500),
(391, 3, 'LEATHER PLATE SWING/TSM72/QABLI/', 'TSM72', NULL, 875, 875, 0, 0, 0, 406, 3, 124, 1, NULL, NULL, '2024-09-09 12:46:03', '2024-09-09 12:56:50', 875),
(392, 3, 'STEEL PLATE SWING/TSM72/QABLI/', 'TSM72', NULL, 500, 500, 0, 0, 0, 407, 3, 124, 1, NULL, NULL, '2024-09-09 12:46:31', '2024-09-09 12:56:50', 500),
(393, 3, 'SET PLATE SWING/TSM72/QABLI/', 'TSM72', NULL, 2000, 2000, 0, 0, 0, 408, 3, 124, 1, NULL, NULL, '2024-09-09 12:50:12', '2024-09-09 12:56:50', 2000),
(394, 3, 'WHEEL LEATHER PLATE/EW-170/QABLI/', 'EW-170', NULL, 2800, 2800, 0, 0, 4000, 409, 29, 124, 1, NULL, NULL, '2024-09-09 13:22:28', '2024-09-11 09:27:45', NULL),
(395, 3, 'WHEEL STEEL PLATE/EW-170/QABLI/', 'EW-170', NULL, 2700, 2700, 0, 0, 3800, 410, 29, 124, 1, NULL, NULL, '2024-09-09 13:23:06', '2024-09-11 09:27:45', NULL),
(396, 3, 'SMALL SHIM/EW-170/QABLI/', 'EW-170', NULL, 300, 300, 0, 0, 1000, 411, 29, 124, 1, NULL, NULL, '2024-09-09 13:24:47', '2024-09-11 09:27:45', NULL),
(397, 3, 'AIR FILTER/EW-170/LOCAL/', 'EW-170', NULL, 3000, 3000, 0, 0, 4000, 412, 29, 103, 1, NULL, NULL, '2024-09-09 13:36:29', '2024-09-11 09:27:45', NULL),
(398, 3, 'OIL FILTER/EX200-1/YOUTHAI/', 'EX200-1', NULL, 1750, 1750, 0, 0, 2000, 413, 4, 150, 2, NULL, NULL, '2024-09-09 13:37:35', '2024-09-23 13:21:31', NULL),
(399, 3, 'INNER DRUM LOCK/EW-170/LOCAL/', 'EW-170', NULL, 2500, 2500, 0, 0, 3500, 414, 29, 103, 1, NULL, NULL, '2024-09-10 06:08:41', '2024-09-11 09:27:45', NULL),
(400, 3, 'LEVER KIT/EW-170/NOK CHAINA/', 'EW-170', NULL, 1000, 1000, 0, 0, 1500, 415, 29, 117, 1, NULL, NULL, '2024-09-10 06:10:43', '2024-09-11 09:27:45', NULL),
(401, 3, 'TAI ROD NUT/EW-170/LOCAL/', 'EW-170', NULL, 1000, 1000, 0, 0, 1500, 416, 29, 103, 1, NULL, NULL, '2024-09-10 06:11:54', '2024-09-11 09:27:45', NULL),
(402, 3, 'BOOM KIT/JCB-200/DONGBU/', 'JCB-200', 3000, 2250, 2250, 0, 0, 3000, 417, 30, 100, 2, NULL, NULL, '2024-09-11 10:54:28', '2024-09-11 11:44:25', NULL),
(403, 3, 'PILOT FILTER/EX200-1/WILSON/', 'EX200-1', 1000, 700, 700, 0, 0, 1350, 418, 4, 104, 2, NULL, NULL, '2024-09-11 10:55:09', '2024-10-15 12:10:52', NULL),
(404, 3, 'ASSYMBLY KIT/S-225/BT KOREA/', 'S-225', 12000, 3500, 3500, 0, 0, 0, 419, 10, 96, 1, NULL, NULL, '2024-09-11 10:55:50', '2024-09-11 11:32:36', 3500),
(405, 3, 'ASSYMBLY KIT/DX-225/BT KOREA/', 'DX-225', 12000, 3500, 3500, 0, 0, 0, 420, 20, 96, 1, NULL, NULL, '2024-09-11 10:58:13', '2024-09-11 11:32:36', 3500),
(406, 3, 'FOOT JACK KIT/EW-170/DONGBU/', 'EW-170', NULL, 1300, 1300, 0, 0, 2500, 421, 29, 100, 1, NULL, NULL, '2024-09-11 11:00:40', '2024-09-23 12:51:17', NULL),
(407, 3, 'PISTON KIT/S-130-5/CHAINA/', 'S-130-5', NULL, 1000, 1000, 0, 0, 1250, 422, 1, 109, 1, NULL, NULL, '2024-09-11 11:17:29', '2024-09-23 13:17:03', NULL),
(408, 3, 'O-RING/1115*3/CHAINA/H5V80 HEAD RING', '1115*3', NULL, 100, 100, 0, 0, 150, 423, 1, 109, 1, NULL, NULL, '2024-09-11 11:19:07', '2024-09-23 13:17:03', NULL),
(409, 3, 'PISTON PATTI/EW-170/CHAINA/', 'EW-170', NULL, 500, 500, 0, 0, 960, 424, 29, 109, 1, NULL, NULL, '2024-09-11 11:19:43', '2024-09-23 12:51:17', NULL),
(410, 3, 'INNER DRUM/DX-140/KYG CHAINA/', 'DX-140', NULL, 29000, 29000, 0, 0, 29500, 425, 3, 113, 1, NULL, NULL, '2024-09-11 11:20:41', '2024-10-21 13:24:25', NULL),
(411, 3, 'CYLINDER BLOCK/HPV116/HANDOK/', 'HPV116', NULL, 33500, 33500, 0, 0, 36000, 426, 4, 97, 2, NULL, NULL, '2024-09-11 11:21:27', '2024-09-14 11:43:19', NULL),
(412, 3, 'SERVO PISTON PIN/HPV116/HANDOK/', 'HPV116', NULL, 1600, 1600, 0, 0, 2000, 427, 4, 97, 2, NULL, NULL, '2024-09-11 11:23:48', '2024-09-14 11:43:19', NULL),
(413, 3, 'REGULATOR PIN/H3V63/CHAINA/', 'H3V63', NULL, 1000, 1000, 0, 0, 0, 428, 1, 109, 1, NULL, NULL, '2024-09-11 11:28:35', '2024-09-14 13:05:00', 1000),
(414, 3, 'PISTON SHOE PUMP/A8V86/HANDOK/', 'A8V86', NULL, 29500, 29500, 0, 0, 31000, 429, 9, 97, 1, NULL, NULL, '2024-09-11 11:29:19', '2024-09-14 13:20:35', NULL),
(415, 3, 'SUN GEAR/FRONT S140-5/KYG CHAINA/', 'FRONT S140-5', NULL, 5500, 5500, 0, 0, 6500, 430, 2, 113, 1, NULL, NULL, '2024-09-14 13:07:59', '2024-09-14 13:45:33', NULL),
(416, 3, 'WATER BODY/S-140-5/CHAINA/', 'S-140-5', NULL, 10500, 10500, 0, 0, 0, 431, 2, 109, 1, NULL, NULL, '2024-09-14 13:23:56', '2024-09-14 13:25:05', 10500),
(417, 3, 'JACK HAMMER KIT/NPK-7XB/NOK CHAINA/', 'NPK-7XB', NULL, 3200, 3200, 0, 0, 0, 432, 5, 117, NULL, NULL, NULL, '2024-09-15 11:18:39', '2024-09-19 05:54:30', 3200),
(418, 3, 'ENGINE FOUNDATION/S-130-5/CHAINA/', 'S-130-5', NULL, 1000, 1000, 0, 0, 1300, 433, 1, 109, 1, NULL, NULL, '2024-09-19 08:58:14', '2024-09-30 13:06:17', NULL),
(419, 3, 'VALVE PLATE/A6VM107/HANDOK/', 'A6VM107', NULL, 12000, 12000, 0, 0, 0, 434, 3, 97, 1, NULL, NULL, '2024-09-19 09:22:55', '2024-09-19 09:25:37', 12000),
(420, 3, 'SET PLATE PUMP/A8V080/HANDOK/', 'A8V080', NULL, 5000, 5000, 0, 0, 0, 435, 3, 97, 1, NULL, NULL, '2024-09-19 09:23:24', '2024-09-19 09:25:37', 5000),
(421, 3, 'PUMP KIT/HPV145/NOK CHAINA/', 'HPV145', NULL, 1500, 1500, 0, 0, 2000, 436, 32, 117, 2, NULL, NULL, '2024-09-19 11:16:12', '2024-10-13 05:46:02', 1466.6666666667),
(422, 3, 'PUMP KIT/HPV145/BT KOREA/', 'HPV145', NULL, 1600, 1600, 0, 0, 0, 437, 32, 96, 2, NULL, NULL, '2024-09-19 11:16:58', '2024-09-19 11:26:13', 1400),
(423, 3, 'VALVE PLATE/HPV145/MACHINERY/', 'HPV145', NULL, 21000, 21000, 0, 0, 25000, 438, 32, 127, 2, NULL, NULL, '2024-09-19 11:17:29', '2024-09-22 05:29:09', NULL),
(424, 3, 'T/M SEAL KIT/DX-140/NOK/', 'DX-140', NULL, 9000, 9000, 0, 0, 0, 439, 3, 101, 1, NULL, NULL, '2024-09-19 11:22:10', '2024-09-19 11:23:23', 9000),
(425, 3, 'PUMP BERING/30209/koyo/DX-140 SMALL', '30209', NULL, 1800, 1800, 0, 0, 3000, 440, 3, 107, 1, NULL, NULL, '2024-09-19 11:28:12', '2024-09-22 05:06:12', NULL),
(426, 3, 'CENTRE JOINT KIT/EX-100/NOK CHAINA/', 'EX-100', NULL, 5500, 5500, 0, 0, 6500, 441, 6, 117, 1, NULL, NULL, '2024-09-19 14:43:25', '2024-09-19 14:45:36', NULL),
(427, 3, 'GEAR PUMP/EX200-1/FIRST/', 'EX200-1', NULL, 5500, 5500, 0, 0, 0, 442, 4, 111, 2, NULL, NULL, '2024-09-19 14:48:13', '2024-09-19 14:48:45', 5500),
(428, 3, 'VALVE PLATE/LH-A8VO80/HANDOK/', 'LH-A8VO80', NULL, 12000, 12000, 0, 0, 13500, 443, 3, 97, 1, NULL, NULL, '2024-09-21 04:56:54', '2024-09-22 05:06:12', NULL),
(429, 3, 'VALVE PLATE/RH-A8VO80/HANDOK/', 'RH-A8VO80', NULL, 12000, 12000, 0, 0, 13500, 444, 3, 97, 1, NULL, NULL, '2024-09-21 04:57:31', '2024-09-22 05:06:12', NULL),
(430, 3, 'PISTON SHOE PUMP/A8V080/MACHINERY/', 'A8V080', NULL, 28500, 28500, 0, 0, 32500, 445, 3, 127, 1, NULL, NULL, '2024-09-21 05:38:04', '2024-09-22 05:06:12', NULL),
(431, 3, 'CYLINDER BLOCK/A8V080/HANDOK/', 'A8V080', NULL, NULL, 0, 0, 0, 0, 446, 3, 97, 1, NULL, NULL, '2024-09-21 05:38:38', '2024-09-21 05:38:38', 0),
(432, 3, 'CYLINDER BLOCK/A8V080/MACHINERY/', 'A8V080', NULL, 36000, 36000, 0, 0, 42000, 447, 3, 127, 1, NULL, NULL, '2024-09-21 05:41:00', '2024-09-22 05:06:12', NULL),
(433, 3, 'OIL FILTER/EX200-1/SHAKURA/', 'EX200-1', NULL, 2400, 2400, 0, 0, 2900, 448, 4, 151, 2, NULL, NULL, '2024-09-22 04:38:03', '2024-10-07 10:49:05', NULL),
(434, 3, 'SUN GEAR/REAR-DX-140/BKT/', 'REAR-DX-140', NULL, 5500, 5500, 0, 0, 6000, 449, 3, 152, 1, NULL, NULL, '2024-09-22 04:41:14', '2024-09-22 05:10:49', 5500),
(435, 3, 'WHEEL GEAR/D/L-DX-140/BKT/', 'D/L-DX-140', NULL, 2750, 2750, 0, 0, 0, 450, 3, 152, 1, NULL, NULL, '2024-09-22 04:43:11', '2024-09-22 04:45:21', 2750),
(436, 3, 'FAN BELT/B-47/CHAINA/', 'B-47', NULL, 450, 450, 0, 0, 600, 451, 4, 109, 2, NULL, NULL, '2024-09-22 04:47:33', '2024-09-23 13:21:31', NULL),
(437, 3, 'K-2/OIL/LOCAL/', 'OIL', NULL, 330, 330, 0, 0, 350, 452, 5, 103, NULL, NULL, NULL, '2024-09-22 04:58:49', '2024-10-20 08:06:16', 330),
(438, 3, 'MAIN RELEIFE VALVE/S-140-5/CHAINA/', 'S-140-5', NULL, 13000, 13000, 0, 0, 22000, 453, 3, 109, 1, NULL, NULL, '2024-09-22 06:35:51', '2024-09-22 06:41:33', NULL),
(439, 3, 'LEVER KIT/DX-140/DONGBU/', 'DX-140', NULL, 350, 350, 0, 0, 500, 454, 3, 100, 1, NULL, NULL, '2024-09-23 12:56:07', '2024-09-23 13:17:03', NULL),
(440, 3, 'BUCKET KIT/HALF-S130-5/DONGBU/', 'HALF-S130-5', NULL, 1150, 1150, 0, 0, 1350, 455, 2, 100, 1, NULL, NULL, '2024-09-23 13:10:18', '2024-09-23 13:17:03', NULL),
(441, 3, 'HOUSING BERING/BIG-EX-100/KOYO/21319RHRW33/700603', 'BIG-EX-100', NULL, 13000, 13000, 0, 0, 16000, 456, 6, 153, 2, NULL, NULL, '2024-09-24 05:20:56', '2024-09-24 05:41:48', NULL),
(442, 3, 'HOUSING BERING/SMALL-EX-100/KOYO/22216RHRW33/C0102', 'SMALL-EX-100', NULL, 5000, 5000, 0, 0, 6500, 457, 6, 153, 2, NULL, NULL, '2024-09-24 05:22:09', '2024-09-24 05:41:48', NULL),
(443, 3, 'HOUSING SEAL/EX-100/CHAINA/TAY-180*210*16/18', 'EX-100', NULL, 3000, 3000, 0, 0, 4500, 458, 6, 109, 2, NULL, NULL, '2024-09-24 05:27:30', '2024-09-24 05:41:49', NULL),
(444, 3, 'CRAWLING MOTOR KIT/RING+SEAL/CHAINA/DX-140', 'RING+SEAL', NULL, 600, 600, 0, 0, 1500, 459, 3, 109, 1, NULL, NULL, '2024-09-24 12:07:00', '2024-09-25 06:24:47', NULL),
(445, 3, 'SHIKANJA KIT/30MM/DONGBU/', '30MM', NULL, 750, 750, 0, 0, 1000, 460, 5, 100, NULL, NULL, NULL, '2024-09-24 12:07:35', '2024-09-25 06:22:48', NULL),
(446, 3, 'CUP BUSH/30*30/CHAINA/', '30*30', NULL, 250, 250, 0, 0, 500, 461, 5, 109, NULL, NULL, NULL, '2024-09-24 12:08:03', '2024-09-25 06:22:48', NULL),
(447, 3, 'BUCKET KIT/ZX-200/DONGBU/', 'ZX-200', NULL, 2000, 2000, 0, 0, 2700, 462, 33, 100, NULL, NULL, NULL, '2024-09-24 12:08:51', '2024-09-24 12:14:41', NULL),
(448, 3, 'END SHIM/DX-210/CHAINA/', 'DX-210', NULL, 3500, 3500, 0, 0, 4500, 463, 20, 109, 1, NULL, NULL, '2024-09-24 12:17:22', '2024-09-24 12:19:26', NULL),
(449, 3, 'CHECK NUT/WHEEL-S-130-5/CHAINA/', 'WHEEL-S-130-5', NULL, 2000, 2000, 0, 0, 2500, 464, 1, 109, 1, NULL, NULL, '2024-09-24 12:59:14', '2024-09-24 13:01:31', NULL),
(450, 3, 'CUP BUSH/55*35/CHAINA/', '55*35', NULL, 300, 300, 0, 0, 600, 465, 31, 109, NULL, NULL, NULL, '2024-09-25 05:41:30', '2024-09-25 06:22:48', NULL),
(451, 3, 'SHIKANJA KIT/55MM/DONGBU/', '55MM', NULL, 600, 600, 0, 0, 1150, 466, 31, 100, NULL, NULL, NULL, '2024-09-25 05:42:06', '2024-09-25 06:22:48', NULL),
(452, 3, 'SHAFT BERING/NUP-205E/KOYO/', 'NUP-205E', NULL, 2300, 2300, 0, 0, 3500, 467, 31, 153, 1, NULL, NULL, '2024-09-25 06:15:55', '2024-09-25 06:24:47', NULL),
(453, 3, 'MAIN RELEIFE VALVE/S-140-5/RKS/', 'S-140-5', NULL, 14200, 14200, 0, 0, 0, 468, 3, 144, 1, NULL, NULL, '2024-09-25 06:31:21', '2024-09-25 06:33:06', 14200),
(454, 3, 'WHEEL GEAR/R-1400/KYG CHAINA/', 'R-1400', NULL, 2700, 2700, 0, 0, 0, 469, 11, 113, 1, NULL, NULL, '2024-09-25 12:14:22', '2024-09-25 12:15:31', 2700),
(455, 3, 'CENTRE JOINT KIT/UHO 7-7/NOK CHAINA/', 'UHO 7-7', NULL, 1200, 1200, 0, 0, 0, 470, 19, 117, 2, NULL, NULL, '2024-09-26 14:03:20', '2024-09-26 14:04:00', 1200),
(456, 3, 'Water Separator Filter/VOE1292404/UNITRUCK/UT6091', 'VOE1292404', NULL, NULL, 0, 0, 0, 0, 471, 34, 106, 1, NULL, NULL, '2024-10-02 12:28:40', '2024-10-02 12:28:40', 0),
(457, 3, 'OIL FILTER/XKBH-01969/UNITRUCK/UT4219', 'XKBH-01969', NULL, NULL, 0, 0, 0, 0, 472, 11, 106, 1, NULL, NULL, '2024-10-02 12:36:23', '2024-10-02 12:36:23', 0),
(458, 3, 'FRONT AXCEL/ZTAM-00509A/KYG CHAINA/ZTAM-00509A', 'ZTAM-00509A', 14000, 10500, 10500, 0, 0, 0, 473, 11, 113, 1, NULL, NULL, '2024-10-02 12:56:48', '2024-10-02 12:59:48', 10500),
(459, 3, 'PUMP BERING/322206-J/KOYO/', '322206-J', NULL, 2000, 2000, 0, 0, 4000, 474, 35, 153, 1, NULL, NULL, '2024-10-02 13:02:00', '2024-10-03 06:37:33', NULL),
(460, 3, 'CYLINDER BLOCK/AP2D21/HANDOK/17MM', 'AP2D21', NULL, 17500, 17500, 0, 0, 25500, 475, 35, 97, 1, NULL, NULL, '2024-10-03 05:04:48', '2024-10-03 06:37:33', 17500),
(461, 3, 'PISTON SHOE PUMP/AP2D21/HANDOK/17MM', 'AP2D21', NULL, 14000, 14000, 0, 0, 19500, 476, 35, 97, 1, NULL, NULL, '2024-10-03 05:06:05', '2024-10-03 06:37:33', NULL),
(462, 3, 'SET PLATE PUMP/AP2D21/HANDOK/17MM', 'AP2D21', NULL, 3500, 3500, 0, 0, 4500, 477, 35, 97, 1, NULL, NULL, '2024-10-03 05:06:40', '2024-10-03 06:37:33', NULL),
(463, 3, 'CRAWLING MOTOR KIT/EX-270/NOK CHAINA/', 'EX-270', NULL, 2500, 2500, 0, 0, 3500, 478, 36, 117, 2, NULL, NULL, '2024-10-09 12:43:30', '2024-10-15 12:10:52', NULL),
(464, 3, 'O-RING/75-6/LOCAL/', '75-6', NULL, 85, 85, 0, 0, 110, 479, 5, 103, NULL, NULL, NULL, '2024-10-10 13:13:03', '2024-10-15 12:10:52', NULL),
(465, 3, 'CROSS/34*98/CHAINA/HISA CROSS', '34*98', NULL, 3000, 3000, 0, 0, 3500, 480, 2, 109, 1, NULL, NULL, '2024-10-10 13:59:11', '2024-10-10 14:22:52', NULL),
(466, 3, 'SHAFT BERING/31308-JR/KOYO/HISA BERING', '31308-JR', NULL, 2500, 2500, 0, 0, 3000, 481, 2, 153, 1, NULL, NULL, '2024-10-10 14:02:46', '2024-10-10 14:22:52', NULL),
(467, 3, 'GODA BUSH/S-130-5/BKT/', 'S-130-5', NULL, 1500, 1500, 0, 0, 1800, 482, 2, 152, 1, NULL, NULL, '2024-10-10 14:05:02', '2024-10-10 14:22:52', NULL),
(468, 3, 'SEAL/60*90*12/CHAINA/HISA SEAL', '60*90*12', NULL, 400, 400, 0, 0, 700, 483, 1, 109, 1, NULL, NULL, '2024-10-10 14:07:58', '2024-10-10 14:22:52', NULL),
(469, 3, 'SEAL/DB58/NOK/TIMING SEAL', 'DB58', NULL, 300, 300, 0, 0, 800, 484, 1, 101, 1, NULL, NULL, '2024-10-10 14:10:28', '2024-10-10 14:22:52', NULL),
(470, 3, 'ASSYMBLY KIT/HALF S-130-5/NOK CHAINA/', 'HALF S-130-5', NULL, 1500, 1500, 0, 0, 2500, 485, 9, 117, 1, NULL, NULL, '2024-10-12 07:28:48', '2024-10-12 13:39:31', NULL),
(471, 3, 'JACK HAMMER KIT/SB-50/TEC THANE/', 'SB-50', NULL, 3500, 3500, 0, 0, 5500, 486, 3, 154, 1, NULL, NULL, '2024-10-12 07:50:54', '2024-10-24 09:38:42', NULL),
(472, 3, 'BRAKE FILTER/DX-140/LOCAL/', 'DX-140', NULL, 1000, 1000, 0, 0, 1500, 487, 3, 103, 1, NULL, NULL, '2024-10-12 12:05:00', '2024-10-15 12:20:50', NULL),
(473, 3, 'WATER BODY/S-130-5/CHAINA/CHAINA', 'S-130-5', NULL, 12500, 12500, 0, 0, 13500, 488, 1, 109, 1, NULL, NULL, '2024-10-12 12:08:46', '2024-10-15 12:20:50', NULL),
(474, 3, 'HYDRAULIC GAUGE/S-130-5/CHAINA/', 'S-130-5', NULL, NULL, 0, 0, 0, 0, 489, 9, 109, 1, NULL, NULL, '2024-10-12 13:16:57', '2024-10-12 13:16:57', 0),
(475, 3, 'AIR CLINDER PIPE/S-130-5/LOCAL/', 'S-130-5', NULL, NULL, 0, 0, 0, 0, 490, 5, 103, NULL, NULL, NULL, '2024-10-12 13:18:55', '2024-10-12 13:18:55', 0),
(476, 3, 'PIPE/S-130-5/LOCAL/', 'S-130-5', NULL, 750, 750, 0, 0, 1000, 491, 31, 103, NULL, NULL, NULL, '2024-10-12 13:22:25', '2024-10-16 12:13:52', NULL),
(477, 3, 'GODA PIPE/S-130-5/LOCAL/', 'S-130-5', NULL, 750, 750, 0, 0, 0, 492, 5, 103, NULL, NULL, NULL, '2024-10-12 13:28:19', '2024-10-12 13:36:38', 750),
(478, 3, 'U-PIPE/S-130-5/LOCAL/', 'S-130-5', NULL, 500, 500, 0, 0, 850, 493, 5, 103, NULL, NULL, NULL, '2024-10-12 13:29:23', '2024-10-16 12:13:52', NULL),
(479, 3, 'FAN BELT/S-130-5/CHAINA/1290', 'S-130-5', NULL, 1300, 1300, 0, 0, 1650, 494, 2, 109, 1, NULL, NULL, '2024-10-12 13:31:27', '2024-10-16 12:13:52', NULL),
(480, 3, 'PIPE/CLUMP/LOCAL/', 'CLUMP', NULL, 100, 100, 0, 0, 200, 495, 5, 103, NULL, NULL, NULL, '2024-10-12 13:32:37', '2024-10-19 11:35:51', NULL),
(481, 3, 'SEAL/PUMP A8V86/CHAINA/42*62*7', 'PUMP A8V86', NULL, 500, 500, 0, 0, 1300, 496, 9, 109, NULL, NULL, NULL, '2024-10-13 05:37:35', '2024-10-16 12:13:52', NULL),
(482, 3, 'GEAR OIL/MAX-PG/CHAINA/EP-140', 'MAX-PG', NULL, 640, 640, 0, 0, 750, 497, 5, 109, NULL, NULL, NULL, '2024-10-13 05:47:57', '2024-10-22 11:08:47', NULL),
(483, 3, 'HYDRAULIC OIL/AW-68/PG/PG WHITE', 'AW-68', NULL, 600, 600, 0, 0, 700, 498, 5, 155, NULL, NULL, NULL, '2024-10-14 05:08:43', '2024-10-16 12:13:52', NULL),
(484, 3, 'SUCTION FILTER/EX-200/WILSON/3054', 'EX-200', NULL, 2200, 2200, 0, 0, 3500, 499, 36, 104, 2, NULL, NULL, '2024-10-15 11:58:59', '2024-10-15 12:10:52', NULL),
(485, 3, 'SEAL/COOLER 48MM/LOCAL/', 'COOLER 48MM', NULL, 150, 150, 0, 0, 250, 500, 9, 103, 1, NULL, NULL, '2024-10-15 12:21:36', '2024-10-15 12:23:40', NULL),
(486, 3, 'PIPE/S-130-5/CHAINA/RADIATOR BIG', 'S-130-5', NULL, 1800, 1800, 0, 0, 4500, 501, 9, 109, 1, NULL, NULL, '2024-10-16 11:55:25', '2024-10-16 12:13:52', NULL),
(487, 3, 'PIPE/S-130-5/CHAINA/RADIATOR SMALL', 'S-130-5', NULL, 2500, 2500, 0, 0, 4000, 502, 9, 109, 1, NULL, NULL, '2024-10-16 11:56:19', '2024-10-16 12:13:52', NULL),
(488, 3, 'PIPE/S-130-5/LOCAL/BLOW PIPE', 'S-130-5', NULL, 1500, 1500, 0, 0, 2500, 503, 9, 103, 1, NULL, NULL, '2024-10-16 11:57:01', '2024-10-19 11:35:51', NULL),
(493, 11, 'wind shield/HAV239/Denso/', 'HAV239', NULL, NULL, 0, 0, 0, 0, 508, 27, 156, 16, '2020', '2024', '2024-10-17 12:58:10', '2024-10-18 05:00:13', 0),
(494, 11, 'xvxcvxw44/HAV2399/Denso/', 'HAV2399', NULL, NULL, 0, 0, 0, 0, 509, 37, 156, 16, NULL, NULL, '2024-10-17 12:58:53', '2024-10-17 12:58:53', 0),
(495, 11, 'DOR/HA1212/DENSO/', 'HA1212', NULL, NULL, 0, 0, 0, 0, 510, 38, 157, 16, '2020', '2024', '2024-10-18 05:25:16', '2024-10-18 05:31:34', 0),
(496, 11, 'TYRE/HA1212/JAPAN/JA70', 'HA1212', 1000, 500, 500, 0, 0, 1000, 511, 39, 161, 17, '2021', '2024', '2024-10-18 05:48:12', '2024-10-18 06:22:10', 500),
(498, 19, 'WINDSHEILD/HA0099/DENSO/DE1122', 'HA0099', 2500, 2000, 2000, 0, 0, 2500, 513, 43, 166, 18, '2021', '2024', '2024-10-18 11:23:10', '2024-10-18 12:39:58', 2000),
(499, 3, 'GASS TEE/SB-50/CHAINA/', 'SB-50', NULL, 650, 650, 0, 0, 1000, 514, 9, 109, 1, NULL, NULL, '2024-10-19 11:25:06', '2024-10-19 11:35:51', NULL),
(500, 3, 'ASSYMBLY KIT/S-130-5/CHAINA/', 'S-130-5', NULL, 2500, 2500, 0, 0, 4000, 515, 20, 109, 1, NULL, NULL, '2024-10-19 11:45:54', '2024-10-19 12:00:13', NULL),
(501, 3, 'VALVE PLATE SWING/EX-160/CHAINA/', 'EX-160', NULL, 19500, 19500, 0, 0, 21000, 516, 44, 109, 2, NULL, NULL, '2024-10-19 12:28:43', '2024-10-19 12:30:19', NULL),
(502, 3, 'O-RING/KIT/CHAINA/', 'KIT', NULL, 850, 850, 0, 0, 1050, 517, 5, 109, NULL, NULL, NULL, '2024-10-20 08:02:50', '2024-10-20 08:08:14', NULL),
(503, 3, 'SWING DEVICE KARA/DX-225/QABLI/61 TEETH', 'DX-225', NULL, 42000, 42000, 0, 0, 47000, 518, 20, 124, 1, NULL, NULL, '2024-10-20 13:54:22', '2024-10-21 13:26:51', NULL),
(504, 3, 'BUCKET TEETH/S-130-5/LOCAL/24 INCH', 'S-130-5', NULL, 4800, 4800, 0, 0, 5200, 519, 2, 103, 1, NULL, NULL, '2024-10-20 14:02:27', '2024-10-21 12:49:06', NULL),
(505, 19, 'WINDSHEILD/TE122/CHINA/CH001', 'TE122', 1500, 1000, 1000, 1300, 1500, 1500, 520, 45, 163, 21, '2021', '2024', '2024-10-21 03:56:15', '2024-10-24 05:53:59', 1000),
(506, 19, 'WINDSHEILD/TE122/JAPAN/JA221', 'TE122', 1300, 1000, 1000, 0, 0, 1300, 521, 45, 162, 21, '2020', '2024', '2024-10-21 06:04:11', '2024-10-21 07:43:16', 1000),
(507, 3, 'CROSS/37*104/CHAINA/', '37*104', NULL, 2000, 2000, 0, 0, 3250, 522, 3, 109, 1, NULL, NULL, '2024-10-21 13:12:51', '2024-10-21 13:21:51', NULL),
(508, 3, 'LOCK/EX-270/LOCAL/HOUSING', 'EX-270', NULL, 370, 370, 0, 0, 1000, 523, 4, 103, 2, NULL, NULL, '2024-10-21 13:34:22', '2024-10-22 11:08:47', NULL),
(509, 19, 'Door/SU001/JAPAN/JA200', 'SU001', 1500, 1000, 1000, 0, 0, 1500, 524, 46, 162, 19, '2021', '2024', '2024-10-22 07:30:27', '2024-10-23 04:24:06', 1000),
(510, 3, 'SWING DEVICE SHAFT/DX-225/QABLI/22-13 TEETH', 'DX-225', NULL, 65000, 65000, 0, 0, 68000, 525, 20, 124, 1, NULL, NULL, '2024-10-22 11:56:14', '2024-10-22 12:00:41', NULL),
(511, 3, 'CHAIN BOLT/S-130-5/LOCAL/16MM', 'S-130-5', NULL, 90, 90, 0, 0, 95, 526, 2, 103, 1, NULL, NULL, '2024-10-23 13:28:47', '2024-10-23 13:39:14', NULL),
(512, 3, 'LOCK/TITE/CHAINA/', 'TITE', NULL, 600, 600, 0, 0, 750, 527, 31, 109, NULL, NULL, NULL, '2024-10-23 13:29:25', '2024-10-23 13:39:14', NULL),
(513, 3, 'CHAIN ADJUSTER KIT/ZX-450/NOK CHAINA/', 'ZX-450', NULL, 850, 850, 0, 0, 1750, 528, 47, 117, 2, NULL, NULL, '2024-10-23 13:33:51', '2024-10-23 13:37:48', NULL),
(514, 3, 'JACK HAMMER KIT/SB-50/NOK CHAINA/', 'SB-50', NULL, 2000, 2000, 0, 0, 0, 529, 9, 117, 1, NULL, NULL, '2024-10-24 09:40:27', '2024-10-24 09:42:21', 2000),
(515, 19, 'Seat Cover Honda 125/H333/JAPAN/', 'H333', 800, 500, 500, 0, 0, 0, 530, 48, 162, 19, '2020', '2024', '2024-10-25 10:29:51', '2024-10-25 10:45:48', 500),
(516, 19, 'Back Light For Honda 125/H01/JAPAN/J10', 'H01', NULL, NULL, 0, 0, 0, 0, 531, 48, 162, 19, '2021', '2024', '2024-10-25 10:42:48', '2024-10-25 10:42:48', 0),
(517, 19, 'Clutch Lever  Honda 125/H99/JAPAN/J88', 'H99', NULL, 300, 300, 0, 0, 0, 532, 48, 162, 19, '2021', '2024', '2024-10-25 10:47:59', '2024-10-28 05:57:22', 300),
(518, 19, 'Battery For Honda 125/H78/JAPAN/J56', 'H78', NULL, NULL, 0, 0, 0, 0, 533, 48, 162, 19, '2021', '2024', '2024-10-25 10:50:54', '2024-10-25 10:50:54', 0),
(519, 19, 'Air Filter For Honda 125/H09/JAPAN/J80', 'H09', NULL, NULL, 0, 0, 0, 0, 534, 48, 162, 19, '2021', '2024', '2024-10-25 10:52:58', '2024-10-25 10:52:58', 0),
(520, 19, 'Pressure Plate For Yamaha VBR 125G/J01/JAPAN/Y10', 'J01', NULL, NULL, 0, 0, 0, 0, 535, 50, 162, 19, '2021', '2024', '2024-10-25 11:01:17', '2024-10-25 11:01:17', 0),
(521, 19, 'Chain Kit For VBR 125G/Y30/JAPAN/J03', 'Y30', NULL, NULL, 0, 0, 0, 0, 536, 50, 162, 19, '2021', '2024', '2024-10-25 11:03:24', '2024-10-25 11:03:24', 0),
(522, 19, 'Plug Cap for VBR 125G/Y03/JAPAN/J20', 'Y03', NULL, NULL, 0, 0, 0, 0, 537, 50, 162, 19, '2022', '2024', '2024-10-25 11:05:30', '2024-10-25 11:05:30', 0),
(523, 19, 'TYRE For VBR 125G/Y89/CHINA/C12', 'Y89', NULL, NULL, 0, 0, 0, 0, 538, 50, 163, 19, '2020', '2024', '2024-10-25 11:10:27', '2024-10-25 11:10:27', 0),
(524, 19, 'GR 150 HEADLIGHT/P01/JAPAN/J10', 'P01', NULL, NULL, 0, 0, 0, 0, 539, 52, 162, 19, '2022', '2024', '2024-10-25 11:18:40', '2024-10-25 11:18:40', 0),
(525, 19, 'GR150 COMPLETE SPEEDOMETER/P98/JAPAN/J55', 'P98', NULL, NULL, 0, 0, 0, 0, 540, 52, 162, 19, '2022', '2024', '2024-10-25 11:38:32', '2024-10-25 11:38:32', 0),
(526, 19, 'GR 150 FRONT DISK PADS/P33/CHINA/C22', 'P33', NULL, NULL, 0, 0, 0, 0, 541, 52, 163, 19, '2022', '2024', '2024-10-25 11:42:04', '2024-10-25 11:42:04', 0),
(527, 19, 'Chain Kit For  RX3/R010/JAPAN/J021', 'R010', NULL, NULL, 0, 0, 0, 0, 542, 53, 162, 19, '2021', '2024', '2024-10-25 11:55:09', '2024-10-25 11:55:09', 0),
(528, 19, 'Crown Brake Shoe Set with Spring for RX3/R66/JAPAN/J55', 'R66', NULL, NULL, 0, 0, 0, 0, 543, 53, 162, 19, '2022', '2024', '2024-10-25 12:06:12', '2024-10-25 12:06:12', 0),
(529, 3, 'HYDRAULIC FILTER/R-1400/HLX/HLX-8949', 'R-1400', 5000, 4500, 4500, 0, 0, 5000, 544, 11, 126, 1, NULL, NULL, '2024-10-27 11:17:46', '2024-10-27 11:36:25', NULL),
(530, 3, 'LEATHER PLATE/M2X63/CHAINA/', 'M2X63', NULL, 1250, 1250, 0, 0, 0, 545, 9, 109, 1, NULL, NULL, '2024-10-27 11:21:32', '2024-10-27 11:33:05', 1250),
(531, 3, 'STEEL PLATE/M2X63/CHAINA/', 'M2X63', NULL, 1000, 1000, 0, 0, 0, 546, 11, 109, NULL, NULL, NULL, '2024-10-27 11:23:22', '2024-10-27 11:33:05', 1000),
(532, 3, 'SCREW BOLT/A8V55/HANDOK/', 'A8V55', NULL, 70, 70, 0, 0, 0, 547, 6, 97, 2, NULL, NULL, '2024-10-27 11:25:45', '2024-10-27 11:40:12', 70),
(533, 3, 'SCREW BOLT/A8V86/HANDOK/', 'A8V86', NULL, 69, 69, 0, 0, 0, 548, 9, 97, 1, NULL, NULL, '2024-10-27 11:26:21', '2024-10-27 11:40:12', 69),
(534, 14, 'OWNER CAPITAL65/45645/fdg/', '45645', 10, 5, 10, 0, 0, 0, 549, 56, 169, NULL, NULL, NULL, '2024-12-17 09:18:50', '2024-12-17 12:51:16', 763.66658432148);

-- --------------------------------------------------------

--
-- Table structure for table `machine_part_types`
--

CREATE TABLE `machine_part_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `machine_part_types`
--

INSERT INTO `machine_part_types` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Single', NULL, NULL),
(2, NULL, 'Set', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `makes`
--

CREATE TABLE `makes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `makes`
--

INSERT INTO `makes` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 3, 'DOOSAN', '2024-07-09 08:10:41', '2024-07-09 08:10:41'),
(2, 3, 'VOLVO', '2024-07-09 08:10:53', '2024-07-09 08:10:53'),
(3, 3, 'HYUNDAI', '2024-07-09 08:11:15', '2024-07-09 08:11:15'),
(4, 3, 'HITACHI', '2024-07-09 08:11:27', '2024-07-09 08:11:27'),
(5, 3, 'SAMSUNG', '2024-07-09 08:11:40', '2024-07-09 08:11:40'),
(6, 3, 'UNIVERSAL', '2024-07-09 10:35:39', '2024-07-09 10:35:39'),
(7, 3, 'SAMSUNG', '2024-07-10 11:46:52', '2024-07-10 11:46:52'),
(8, 3, 'HYUNDAI', '2024-07-12 04:52:26', '2024-07-12 04:52:26'),
(9, 3, 'MITSUBISHI', '2024-07-20 13:17:19', '2024-07-20 13:17:19'),
(16, 6, 'Hundai', '2024-08-05 08:29:33', '2024-08-05 08:29:33'),
(17, 6, 'dosan', '2024-08-06 06:01:07', '2024-08-06 06:01:07'),
(18, 6, 'Hundai', '2024-08-06 06:20:14', '2024-08-06 06:20:14'),
(19, 6, 'HAVEL', '2024-08-12 09:45:03', '2024-08-12 09:45:03'),
(20, 8, 'maketest', '2024-08-22 10:43:01', '2024-08-22 10:43:01'),
(21, 10, 'honda', '2024-08-26 06:44:10', '2024-08-26 06:44:10'),
(22, 10, 'toyota', '2024-08-26 06:44:24', '2024-08-26 06:44:24'),
(23, 10, 'suzuki', '2024-08-26 06:44:35', '2024-08-26 06:44:35'),
(24, 11, 'eee', '2024-08-28 08:20:49', '2024-08-28 08:20:49'),
(25, 13, 'zain', '2024-08-30 10:53:55', '2024-08-30 10:53:55'),
(26, 3, 'JCB', '2024-09-11 10:53:06', '2024-09-11 10:53:06'),
(27, 3, 'VALVO', '2024-10-02 12:23:26', '2024-10-02 12:23:26'),
(28, 11, 'honda', '2024-10-17 05:46:44', '2024-10-17 05:46:44'),
(29, 11, 'Honda', '2024-10-17 08:16:50', '2024-10-17 08:16:50'),
(30, 11, 'Haval', '2024-10-17 08:35:44', '2024-10-17 08:35:44'),
(31, 11, 'Haval', '2024-10-17 09:47:29', '2024-10-17 09:47:29'),
(32, 11, 'HAVAL', '2024-10-18 05:12:47', '2024-10-18 05:12:47'),
(33, 11, 'HONDA', '2024-10-18 05:33:07', '2024-10-18 05:33:07'),
(34, 19, 'CD70', '2024-10-18 08:02:32', '2024-10-18 08:02:32'),
(35, 19, 'HONDA', '2024-10-18 08:05:23', '2024-10-18 08:05:23'),
(36, 19, 'HAVAL', '2024-10-18 11:13:29', '2024-10-18 11:13:29'),
(37, 19, 'TESLA', '2024-10-21 03:48:43', '2024-10-21 03:48:43'),
(38, 19, 'Suzuki Alto', '2024-10-22 07:24:25', '2024-10-22 07:24:25'),
(39, 19, 'Honda', '2024-10-25 10:11:02', '2024-10-25 10:11:02'),
(40, 19, 'Yamaha', '2024-10-25 10:54:54', '2024-10-25 10:54:54'),
(41, 19, 'Pak-Suzuki Motors', '2024-10-25 11:12:44', '2024-10-25 11:12:44'),
(42, 19, 'Road Prince', '2024-10-25 11:52:43', '2024-10-25 11:52:43'),
(43, 27, 'suzuki', '2024-10-28 12:01:53', '2024-10-28 12:01:53'),
(44, 27, 'npr', '2024-10-28 12:04:16', '2024-10-28 12:04:16'),
(45, 14, 'ddd7', '2024-12-17 09:16:58', '2024-12-17 09:16:58');

-- --------------------------------------------------------

--
-- Table structure for table `make_item_parts`
--

CREATE TABLE `make_item_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `machine_part_oem_part_nos_machine_models_id` int(11) DEFAULT NULL,
  `make_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `make_item_parts`
--

INSERT INTO `make_item_parts` (`id`, `user_id`, `machine_part_oem_part_nos_machine_models_id`, `make_id`, `created_at`, `updated_at`) VALUES
(4, NULL, 4, 4, NULL, NULL),
(5, NULL, 5, 1, NULL, NULL),
(6, NULL, 6, 1, NULL, NULL),
(7, NULL, 7, 1, NULL, NULL),
(8, NULL, 8, 1, NULL, NULL),
(9, NULL, 9, 6, NULL, NULL),
(10, NULL, 10, 4, NULL, NULL),
(11, NULL, 11, 4, NULL, NULL),
(12, NULL, 12, 4, NULL, NULL),
(13, NULL, 13, 4, NULL, NULL),
(14, NULL, 14, 1, NULL, NULL),
(15, NULL, 15, 1, NULL, NULL),
(16, NULL, 16, 1, NULL, NULL),
(17, NULL, 17, 1, NULL, NULL),
(18, NULL, 18, 1, NULL, NULL),
(19, NULL, 19, 1, NULL, NULL),
(20, NULL, 20, 1, NULL, NULL),
(21, NULL, 21, 1, NULL, NULL),
(22, NULL, 22, 1, NULL, NULL),
(23, NULL, 23, 1, NULL, NULL),
(24, NULL, 24, 1, NULL, NULL),
(25, NULL, 24, 2, NULL, NULL),
(26, NULL, 25, 4, NULL, NULL),
(27, NULL, 25, 2, NULL, NULL),
(28, NULL, 25, 7, NULL, NULL),
(29, NULL, 26, 1, NULL, NULL),
(30, NULL, 27, 1, NULL, NULL),
(31, NULL, 28, 6, NULL, NULL),
(32, NULL, 29, 6, NULL, NULL),
(33, NULL, 30, 6, NULL, NULL),
(34, NULL, 31, 6, NULL, NULL),
(35, NULL, 32, 6, NULL, NULL),
(36, NULL, 33, 6, NULL, NULL),
(37, NULL, 34, 6, NULL, NULL),
(38, NULL, 35, 6, NULL, NULL),
(39, NULL, 36, 6, NULL, NULL),
(40, NULL, 37, 6, NULL, NULL),
(41, NULL, 38, 1, NULL, NULL),
(42, NULL, 39, 1, NULL, NULL),
(43, NULL, 40, 1, NULL, NULL),
(44, NULL, 41, 1, NULL, NULL),
(45, NULL, 42, 1, NULL, NULL),
(46, NULL, 43, 1, NULL, NULL),
(47, NULL, 44, 1, NULL, NULL),
(48, NULL, 45, 1, NULL, NULL),
(49, NULL, 46, 1, NULL, NULL),
(50, NULL, 46, 4, NULL, NULL),
(51, NULL, 46, 2, NULL, NULL),
(52, NULL, 46, 5, NULL, NULL),
(53, NULL, 47, 1, NULL, NULL),
(54, NULL, 48, 1, NULL, NULL),
(55, NULL, 49, 1, NULL, NULL),
(56, NULL, 50, 1, NULL, NULL),
(57, NULL, 51, 1, NULL, NULL),
(58, NULL, 52, 1, NULL, NULL),
(59, NULL, 53, 1, NULL, NULL),
(60, NULL, 54, 1, NULL, NULL),
(61, NULL, 55, 1, NULL, NULL),
(62, NULL, 56, 1, NULL, NULL),
(63, NULL, 57, 1, NULL, NULL),
(64, NULL, 58, 1, NULL, NULL),
(65, NULL, 59, 1, NULL, NULL),
(66, NULL, 60, 1, NULL, NULL),
(67, NULL, 61, 4, NULL, NULL),
(68, NULL, 62, 1, NULL, NULL),
(69, NULL, 63, 4, NULL, NULL),
(70, NULL, 64, 4, NULL, NULL),
(71, NULL, 65, 4, NULL, NULL),
(72, NULL, 66, 4, NULL, NULL),
(73, NULL, 67, 1, NULL, NULL),
(74, NULL, 68, 1, NULL, NULL),
(75, NULL, 68, 2, NULL, NULL),
(76, NULL, 69, 1, NULL, NULL),
(77, NULL, 69, 2, NULL, NULL),
(78, NULL, 70, 4, NULL, NULL),
(79, NULL, 70, 1, NULL, NULL),
(80, NULL, 71, 4, NULL, NULL),
(81, NULL, 71, 1, NULL, NULL),
(82, NULL, 72, 1, NULL, NULL),
(83, NULL, 73, 1, NULL, NULL),
(84, NULL, 74, 4, NULL, NULL),
(85, NULL, 75, 4, NULL, NULL),
(86, NULL, 76, 4, NULL, NULL),
(87, NULL, 77, 1, NULL, NULL),
(88, NULL, 78, 3, NULL, NULL),
(89, NULL, 79, 1, NULL, NULL),
(90, NULL, 79, 4, NULL, NULL),
(91, NULL, 80, 1, NULL, NULL),
(92, NULL, 81, 4, NULL, NULL),
(93, NULL, 82, 4, NULL, NULL),
(94, NULL, 83, 4, NULL, NULL),
(95, NULL, 84, 1, NULL, NULL),
(96, NULL, 85, 4, NULL, NULL),
(97, NULL, 86, 1, NULL, NULL),
(98, NULL, 87, 1, NULL, NULL),
(99, NULL, 88, 4, NULL, NULL),
(100, NULL, 89, 6, NULL, NULL),
(101, NULL, 90, 4, NULL, NULL),
(102, NULL, 91, 4, NULL, NULL),
(103, NULL, 92, 1, NULL, NULL),
(104, NULL, 93, 4, NULL, NULL),
(105, NULL, 94, 1, NULL, NULL),
(106, NULL, 95, 1, NULL, NULL),
(107, NULL, 96, 1, NULL, NULL),
(108, NULL, 97, 1, NULL, NULL),
(109, NULL, 98, 1, NULL, NULL),
(110, NULL, 99, 1, NULL, NULL),
(111, NULL, 100, 4, NULL, NULL),
(112, NULL, 101, 4, NULL, NULL),
(113, NULL, 102, 1, NULL, NULL),
(114, NULL, 103, 1, NULL, NULL),
(115, NULL, 104, 1, NULL, NULL),
(116, NULL, 105, 4, NULL, NULL),
(117, NULL, 106, 4, NULL, NULL),
(118, NULL, 107, 4, NULL, NULL),
(119, NULL, 108, 3, NULL, NULL),
(120, NULL, 109, 2, NULL, NULL),
(121, NULL, 110, 4, NULL, NULL),
(122, NULL, 111, 1, NULL, NULL),
(123, NULL, 112, 1, NULL, NULL),
(124, NULL, 113, 2, NULL, NULL),
(125, NULL, 114, 4, NULL, NULL),
(126, NULL, 115, 1, NULL, NULL),
(127, NULL, 116, 1, NULL, NULL),
(128, NULL, 117, 4, NULL, NULL),
(129, NULL, 118, 4, NULL, NULL),
(130, NULL, 119, 4, NULL, NULL),
(131, NULL, 120, 1, NULL, NULL),
(132, NULL, 121, 1, NULL, NULL),
(133, NULL, 122, 1, NULL, NULL),
(134, NULL, 123, 1, NULL, NULL),
(135, NULL, 124, 8, NULL, NULL),
(136, NULL, 125, 1, NULL, NULL),
(137, NULL, 126, 4, NULL, NULL),
(138, NULL, 127, 4, NULL, NULL),
(139, NULL, 128, 1, NULL, NULL),
(140, NULL, 129, 1, NULL, NULL),
(141, NULL, 130, 6, NULL, NULL),
(142, NULL, 131, 1, NULL, NULL),
(143, NULL, 132, 1, NULL, NULL),
(144, NULL, 133, 1, NULL, NULL),
(145, NULL, 134, 1, NULL, NULL),
(146, NULL, 135, 1, NULL, NULL),
(147, NULL, 136, 1, NULL, NULL),
(148, NULL, 137, 1, NULL, NULL),
(149, NULL, 138, 1, NULL, NULL),
(150, NULL, 139, 1, NULL, NULL),
(151, NULL, 140, 1, NULL, NULL),
(152, NULL, 141, 1, NULL, NULL),
(153, NULL, 142, 4, NULL, NULL),
(154, NULL, 143, 4, NULL, NULL),
(155, NULL, 144, 4, NULL, NULL),
(156, NULL, 145, 4, NULL, NULL),
(157, NULL, 146, 4, NULL, NULL),
(158, NULL, 147, 4, NULL, NULL),
(159, NULL, 148, 8, NULL, NULL),
(160, NULL, 149, 8, NULL, NULL),
(161, NULL, 150, 3, NULL, NULL),
(162, NULL, 151, 1, NULL, NULL),
(163, NULL, 152, 1, NULL, NULL),
(164, NULL, 153, 1, NULL, NULL),
(165, NULL, 154, 2, NULL, NULL),
(166, NULL, 155, 2, NULL, NULL),
(167, NULL, 156, 2, NULL, NULL),
(168, NULL, 157, 1, NULL, NULL),
(169, NULL, 158, 1, NULL, NULL),
(170, NULL, 159, 1, NULL, NULL),
(171, NULL, 160, 1, NULL, NULL),
(172, NULL, 161, 1, NULL, NULL),
(173, NULL, 162, 4, NULL, NULL),
(174, NULL, 163, 4, NULL, NULL),
(175, NULL, 164, 1, NULL, NULL),
(176, NULL, 165, 1, NULL, NULL),
(177, NULL, 166, 1, NULL, NULL),
(178, NULL, 166, 3, NULL, NULL),
(179, NULL, 167, 1, NULL, NULL),
(180, NULL, 168, 1, NULL, NULL),
(181, NULL, 169, 1, NULL, NULL),
(182, NULL, 170, 1, NULL, NULL),
(183, NULL, 171, 1, NULL, NULL),
(184, NULL, 172, 1, NULL, NULL),
(185, NULL, 173, 1, NULL, NULL),
(186, NULL, 174, 1, NULL, NULL),
(187, NULL, 175, 1, NULL, NULL),
(188, NULL, 176, 1, NULL, NULL),
(189, NULL, 177, 1, NULL, NULL),
(190, NULL, 178, 1, NULL, NULL),
(191, NULL, 179, 1, NULL, NULL),
(192, NULL, 180, 1, NULL, NULL),
(193, NULL, 181, 1, NULL, NULL),
(194, NULL, 182, 1, NULL, NULL),
(195, NULL, 183, 1, NULL, NULL),
(196, NULL, 184, 4, NULL, NULL),
(197, NULL, 185, 4, NULL, NULL),
(198, NULL, 186, 4, NULL, NULL),
(199, NULL, 187, 4, NULL, NULL),
(200, NULL, 188, 1, NULL, NULL),
(201, NULL, 188, 4, NULL, NULL),
(202, NULL, 189, 1, NULL, NULL),
(203, NULL, 190, 4, NULL, NULL),
(204, NULL, 191, 4, NULL, NULL),
(205, NULL, 192, 4, NULL, NULL),
(206, NULL, 193, 1, NULL, NULL),
(207, NULL, 194, 1, NULL, NULL),
(208, NULL, 195, 1, NULL, NULL),
(209, NULL, 196, 1, NULL, NULL),
(210, NULL, 197, 1, NULL, NULL),
(211, NULL, 198, 1, NULL, NULL),
(212, NULL, 199, 1, NULL, NULL),
(213, NULL, 200, 4, NULL, NULL),
(214, NULL, 201, 4, NULL, NULL),
(215, NULL, 202, 4, NULL, NULL),
(216, NULL, 203, 4, NULL, NULL),
(217, NULL, 204, 4, NULL, NULL),
(218, NULL, 205, 1, NULL, NULL),
(219, NULL, 206, 1, NULL, NULL),
(220, NULL, 207, 1, NULL, NULL),
(221, NULL, 208, 1, NULL, NULL),
(222, NULL, 209, 1, NULL, NULL),
(223, NULL, 210, 1, NULL, NULL),
(224, NULL, 211, 4, NULL, NULL),
(225, NULL, 212, 1, NULL, NULL),
(226, NULL, 213, 1, NULL, NULL),
(227, NULL, 214, 1, NULL, NULL),
(228, NULL, 215, 1, NULL, NULL),
(229, NULL, 216, 1, NULL, NULL),
(230, NULL, 217, 1, NULL, NULL),
(231, NULL, 218, 1, NULL, NULL),
(232, NULL, 219, 1, NULL, NULL),
(233, NULL, 220, 6, NULL, NULL),
(234, NULL, 221, 1, NULL, NULL),
(235, NULL, 222, 1, NULL, NULL),
(236, NULL, 223, 4, NULL, NULL),
(237, NULL, 224, 1, NULL, NULL),
(238, NULL, 225, 8, NULL, NULL),
(239, NULL, 226, 1, NULL, NULL),
(240, NULL, 227, 1, NULL, NULL),
(241, NULL, 228, 1, NULL, NULL),
(242, NULL, 229, 1, NULL, NULL),
(243, NULL, 230, 1, NULL, NULL),
(244, NULL, 231, 1, NULL, NULL),
(245, NULL, 232, 1, NULL, NULL),
(246, NULL, 233, 4, NULL, NULL),
(247, NULL, 234, 1, NULL, NULL),
(248, NULL, 235, 1, NULL, NULL),
(249, NULL, 236, 1, NULL, NULL),
(250, NULL, 237, 1, NULL, NULL),
(251, NULL, 238, 1, NULL, NULL),
(252, NULL, 239, 1, NULL, NULL),
(253, NULL, 240, 1, NULL, NULL),
(254, NULL, 241, 1, NULL, NULL),
(255, NULL, 242, 1, NULL, NULL),
(256, NULL, 243, 1, NULL, NULL),
(257, NULL, 244, 1, NULL, NULL),
(258, NULL, 245, 1, NULL, NULL),
(259, NULL, 246, 1, NULL, NULL),
(260, NULL, 247, 1, NULL, NULL),
(261, NULL, 248, 1, NULL, NULL),
(262, NULL, 249, 1, NULL, NULL),
(263, NULL, 250, 1, NULL, NULL),
(264, NULL, 251, 1, NULL, NULL),
(265, NULL, 252, 1, NULL, NULL),
(266, NULL, 253, 1, NULL, NULL),
(267, NULL, 254, 1, NULL, NULL),
(268, NULL, 255, 1, NULL, NULL),
(269, NULL, 256, 1, NULL, NULL),
(270, NULL, 257, 1, NULL, NULL),
(271, NULL, 258, 4, NULL, NULL),
(272, NULL, 259, 4, NULL, NULL),
(273, NULL, 260, 4, NULL, NULL),
(274, NULL, 261, 1, NULL, NULL),
(275, NULL, 262, 1, NULL, NULL),
(276, NULL, 263, 4, NULL, NULL),
(277, NULL, 264, 4, NULL, NULL),
(278, NULL, 265, 1, NULL, NULL),
(279, NULL, 266, 1, NULL, NULL),
(280, NULL, 267, 1, NULL, NULL),
(281, NULL, 268, 1, NULL, NULL),
(282, NULL, 269, 1, NULL, NULL),
(283, NULL, 270, 1, NULL, NULL),
(284, NULL, 271, 4, NULL, NULL),
(285, NULL, 272, 4, NULL, NULL),
(286, NULL, 273, 4, NULL, NULL),
(287, NULL, 274, 1, NULL, NULL),
(288, NULL, 275, 1, NULL, NULL),
(289, NULL, 276, 1, NULL, NULL),
(290, NULL, 277, 1, NULL, NULL),
(291, NULL, 278, 1, NULL, NULL),
(292, NULL, 279, 1, NULL, NULL),
(293, NULL, 280, 1, NULL, NULL),
(294, NULL, 281, 1, NULL, NULL),
(295, NULL, 282, 3, NULL, NULL),
(296, NULL, 283, 1, NULL, NULL),
(297, NULL, 284, 1, NULL, NULL),
(298, NULL, 285, 1, NULL, NULL),
(299, NULL, 286, 1, NULL, NULL),
(300, NULL, 287, 1, NULL, NULL),
(301, NULL, 288, 1, NULL, NULL),
(302, NULL, 289, 1, NULL, NULL),
(303, NULL, 290, 4, NULL, NULL),
(304, NULL, 291, 1, NULL, NULL),
(305, NULL, 292, 4, NULL, NULL),
(306, NULL, 293, 6, NULL, NULL),
(307, NULL, 294, 6, NULL, NULL),
(308, NULL, 295, 9, NULL, NULL),
(309, NULL, 296, 9, NULL, NULL),
(310, NULL, 297, 9, NULL, NULL),
(311, NULL, 298, 9, NULL, NULL),
(312, NULL, 299, 6, NULL, NULL),
(313, NULL, 300, 6, NULL, NULL),
(314, NULL, 301, 6, NULL, NULL),
(315, NULL, 302, 4, NULL, NULL),
(316, NULL, 303, 4, NULL, NULL),
(317, NULL, 304, 1, NULL, NULL),
(318, NULL, 305, 1, NULL, NULL),
(319, NULL, 306, 1, NULL, NULL),
(320, NULL, 307, 4, NULL, NULL),
(321, NULL, 308, 1, NULL, NULL),
(322, NULL, 309, 1, NULL, NULL),
(323, NULL, 310, 1, NULL, NULL),
(324, NULL, 311, 6, NULL, NULL),
(325, NULL, 312, 6, NULL, NULL),
(326, NULL, 313, 1, NULL, NULL),
(327, NULL, 314, 1, NULL, NULL),
(328, NULL, 315, 1, NULL, NULL),
(329, NULL, 316, 1, NULL, NULL),
(330, NULL, 317, 10, NULL, NULL),
(331, NULL, 318, 13, NULL, NULL),
(332, NULL, 319, 14, NULL, NULL),
(333, NULL, 320, 15, NULL, NULL),
(334, NULL, 321, 4, NULL, NULL),
(335, NULL, 322, 1, NULL, NULL),
(336, NULL, 323, 1, NULL, NULL),
(337, NULL, 324, 1, NULL, NULL),
(338, NULL, 325, 1, NULL, NULL),
(339, NULL, 326, 1, NULL, NULL),
(340, NULL, 327, 1, NULL, NULL),
(341, NULL, 328, 1, NULL, NULL),
(342, NULL, 329, 1, NULL, NULL),
(343, NULL, 330, 1, NULL, NULL),
(344, NULL, 331, 4, NULL, NULL),
(345, NULL, 332, 1, NULL, NULL),
(346, NULL, 333, 18, NULL, NULL),
(347, NULL, 334, 16, NULL, NULL),
(348, NULL, 335, 6, NULL, NULL),
(349, NULL, 336, 1, NULL, NULL),
(350, NULL, 337, 1, NULL, NULL),
(351, NULL, 338, 1, NULL, NULL),
(352, NULL, 339, 1, NULL, NULL),
(353, NULL, 340, 1, NULL, NULL),
(354, NULL, 341, 6, NULL, NULL),
(355, NULL, 342, 1, NULL, NULL),
(356, NULL, 343, 1, NULL, NULL),
(357, NULL, 344, 1, NULL, NULL),
(358, NULL, 345, 6, NULL, NULL),
(359, NULL, 346, 1, NULL, NULL),
(360, NULL, 347, 6, NULL, NULL),
(361, NULL, 348, 1, NULL, NULL),
(362, NULL, 349, 4, NULL, NULL),
(363, NULL, 350, 1, NULL, NULL),
(364, NULL, 351, 2, NULL, NULL),
(365, NULL, 352, 1, NULL, NULL),
(366, NULL, 353, 1, NULL, NULL),
(367, NULL, 354, 4, NULL, NULL),
(368, NULL, 355, 4, NULL, NULL),
(369, NULL, 356, 4, NULL, NULL),
(370, NULL, 357, 4, NULL, NULL),
(371, NULL, 358, 1, NULL, NULL),
(372, NULL, 359, 1, NULL, NULL),
(373, NULL, 360, 6, NULL, NULL),
(374, NULL, 361, 6, NULL, NULL),
(375, NULL, 362, 1, NULL, NULL),
(376, NULL, 363, 6, NULL, NULL),
(377, NULL, 364, 19, NULL, NULL),
(378, NULL, 365, 1, NULL, NULL),
(379, NULL, 366, 1, NULL, NULL),
(391, NULL, 1, 24, NULL, NULL),
(392, NULL, 2, 24, NULL, NULL),
(393, NULL, 3, 25, NULL, NULL),
(394, NULL, 367, 1, NULL, NULL),
(395, NULL, 368, 1, NULL, NULL),
(396, NULL, 369, 4, NULL, NULL),
(397, NULL, 370, 2, NULL, NULL),
(398, NULL, 371, 2, NULL, NULL),
(399, NULL, 372, 3, NULL, NULL),
(400, NULL, 373, 2, NULL, NULL),
(401, NULL, 374, 2, NULL, NULL),
(402, NULL, 375, 2, NULL, NULL),
(403, NULL, 376, 2, NULL, NULL),
(404, NULL, 377, 2, NULL, NULL),
(405, NULL, 378, 2, NULL, NULL),
(406, NULL, 379, 2, NULL, NULL),
(407, NULL, 380, 1, NULL, NULL),
(408, NULL, 381, 2, NULL, NULL),
(409, NULL, 381, 1, NULL, NULL),
(410, NULL, 382, 1, NULL, NULL),
(411, NULL, 383, 1, NULL, NULL),
(412, NULL, 384, 1, NULL, NULL),
(413, NULL, 385, 1, NULL, NULL),
(414, NULL, 386, 1, NULL, NULL),
(415, NULL, 387, 1, NULL, NULL),
(416, NULL, 388, 1, NULL, NULL),
(417, NULL, 389, 1, NULL, NULL),
(418, NULL, 390, 1, NULL, NULL),
(419, NULL, 391, 1, NULL, NULL),
(420, NULL, 392, 1, NULL, NULL),
(421, NULL, 393, 1, NULL, NULL),
(422, NULL, 394, 2, NULL, NULL),
(423, NULL, 395, 2, NULL, NULL),
(424, NULL, 396, 2, NULL, NULL),
(425, NULL, 397, 2, NULL, NULL),
(426, NULL, 398, 4, NULL, NULL),
(427, NULL, 399, 2, NULL, NULL),
(428, NULL, 400, 2, NULL, NULL),
(429, NULL, 401, 2, NULL, NULL),
(430, NULL, 402, 26, NULL, NULL),
(431, NULL, 403, 4, NULL, NULL),
(432, NULL, 404, 1, NULL, NULL),
(433, NULL, 405, 1, NULL, NULL),
(434, NULL, 406, 2, NULL, NULL),
(435, NULL, 407, 1, NULL, NULL),
(436, NULL, 408, 1, NULL, NULL),
(437, NULL, 409, 2, NULL, NULL),
(438, NULL, 410, 1, NULL, NULL),
(439, NULL, 411, 4, NULL, NULL),
(440, NULL, 412, 4, NULL, NULL),
(441, NULL, 413, 1, NULL, NULL),
(442, NULL, 414, 1, NULL, NULL),
(443, NULL, 415, 1, NULL, NULL),
(444, NULL, 416, 1, NULL, NULL),
(445, NULL, 417, 1, NULL, NULL),
(446, NULL, 418, 1, NULL, NULL),
(447, NULL, 419, 1, NULL, NULL),
(448, NULL, 420, 1, NULL, NULL),
(449, NULL, 421, 4, NULL, NULL),
(450, NULL, 422, 4, NULL, NULL),
(451, NULL, 423, 4, NULL, NULL),
(452, NULL, 424, 1, NULL, NULL),
(453, NULL, 425, 1, NULL, NULL),
(454, NULL, 426, 4, NULL, NULL),
(455, NULL, 427, 4, NULL, NULL),
(456, NULL, 428, 1, NULL, NULL),
(457, NULL, 429, 1, NULL, NULL),
(458, NULL, 430, 1, NULL, NULL),
(459, NULL, 431, 1, NULL, NULL),
(460, NULL, 432, 1, NULL, NULL),
(461, NULL, 433, 4, NULL, NULL),
(462, NULL, 434, 1, NULL, NULL),
(463, NULL, 435, 1, NULL, NULL),
(464, NULL, 436, 4, NULL, NULL),
(465, NULL, 437, 6, NULL, NULL),
(466, NULL, 438, 1, NULL, NULL),
(467, NULL, 439, 1, NULL, NULL),
(468, NULL, 440, 1, NULL, NULL),
(469, NULL, 441, 4, NULL, NULL),
(470, NULL, 442, 4, NULL, NULL),
(471, NULL, 443, 4, NULL, NULL),
(472, NULL, 444, 1, NULL, NULL),
(473, NULL, 445, 1, NULL, NULL),
(474, NULL, 446, 1, NULL, NULL),
(475, NULL, 447, 4, NULL, NULL),
(476, NULL, 448, 1, NULL, NULL),
(477, NULL, 449, 1, NULL, NULL),
(478, NULL, 450, 6, NULL, NULL),
(479, NULL, 451, 6, NULL, NULL),
(480, NULL, 452, 1, NULL, NULL),
(481, NULL, 453, 1, NULL, NULL),
(482, NULL, 454, 3, NULL, NULL),
(483, NULL, 455, 4, NULL, NULL),
(484, NULL, 456, 2, NULL, NULL),
(485, NULL, 457, 3, NULL, NULL),
(486, NULL, 458, 3, NULL, NULL),
(487, NULL, 459, 1, NULL, NULL),
(488, NULL, 460, 1, NULL, NULL),
(489, NULL, 461, 1, NULL, NULL),
(490, NULL, 462, 1, NULL, NULL),
(491, NULL, 463, 4, NULL, NULL),
(492, NULL, 464, 6, NULL, NULL),
(493, NULL, 465, 1, NULL, NULL),
(494, NULL, 466, 1, NULL, NULL),
(495, NULL, 467, 1, NULL, NULL),
(496, NULL, 468, 1, NULL, NULL),
(497, NULL, 469, 1, NULL, NULL),
(498, NULL, 470, 1, NULL, NULL),
(499, NULL, 471, 1, NULL, NULL),
(500, NULL, 472, 1, NULL, NULL),
(501, NULL, 473, 1, NULL, NULL),
(502, NULL, 474, 1, NULL, NULL),
(503, NULL, 475, 6, NULL, NULL),
(504, NULL, 476, 6, NULL, NULL),
(505, NULL, 477, 6, NULL, NULL),
(506, NULL, 478, 1, NULL, NULL),
(507, NULL, 479, 1, NULL, NULL),
(508, NULL, 480, 6, NULL, NULL),
(509, NULL, 481, 1, NULL, NULL),
(510, NULL, 482, 6, NULL, NULL),
(511, NULL, 483, 6, NULL, NULL),
(512, NULL, 484, 4, NULL, NULL),
(513, NULL, 485, 1, NULL, NULL),
(514, NULL, 486, 1, NULL, NULL),
(515, NULL, 487, 1, NULL, NULL),
(516, NULL, 488, 1, NULL, NULL),
(517, NULL, 489, 28, NULL, NULL),
(518, NULL, 490, 30, NULL, NULL),
(519, NULL, 491, 30, NULL, NULL),
(520, NULL, 492, 30, NULL, NULL),
(521, NULL, 493, 30, NULL, NULL),
(522, NULL, 494, 24, NULL, NULL),
(523, NULL, 495, 32, NULL, NULL),
(524, NULL, 496, 33, NULL, NULL),
(525, NULL, 497, 35, NULL, NULL),
(526, NULL, 498, 36, NULL, NULL),
(527, NULL, 499, 1, NULL, NULL),
(528, NULL, 500, 1, NULL, NULL),
(529, NULL, 501, 4, NULL, NULL),
(530, NULL, 502, 6, NULL, NULL),
(531, NULL, 503, 1, NULL, NULL),
(532, NULL, 504, 1, NULL, NULL),
(533, NULL, 505, 37, NULL, NULL),
(534, NULL, 506, 37, NULL, NULL),
(535, NULL, 507, 1, NULL, NULL),
(536, NULL, 508, 4, NULL, NULL),
(537, NULL, 509, 38, NULL, NULL),
(538, NULL, 510, 1, NULL, NULL),
(539, NULL, 511, 1, NULL, NULL),
(540, NULL, 512, 6, NULL, NULL),
(541, NULL, 513, 4, NULL, NULL),
(542, NULL, 514, 1, NULL, NULL),
(543, NULL, 515, 35, NULL, NULL),
(544, NULL, 516, 35, NULL, NULL),
(545, NULL, 517, 35, NULL, NULL),
(546, NULL, 518, 35, NULL, NULL),
(547, NULL, 519, 35, NULL, NULL),
(548, NULL, 520, 40, NULL, NULL),
(549, NULL, 521, 40, NULL, NULL),
(550, NULL, 522, 40, NULL, NULL),
(551, NULL, 523, 40, NULL, NULL),
(552, NULL, 524, 41, NULL, NULL),
(553, NULL, 525, 41, NULL, NULL),
(554, NULL, 526, 41, NULL, NULL),
(555, NULL, 527, 42, NULL, NULL),
(556, NULL, 528, 42, NULL, NULL),
(557, NULL, 529, 3, NULL, NULL),
(558, NULL, 530, 1, NULL, NULL),
(559, NULL, 531, 3, NULL, NULL),
(560, NULL, 532, 1, NULL, NULL),
(561, NULL, 533, 1, NULL, NULL),
(562, NULL, 534, 45, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_item_parts`
--

CREATE TABLE `model_item_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `machine_part_oem_part_nos_machine_models_id` int(11) DEFAULT NULL,
  `machine_model_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_item_parts`
--

INSERT INTO `model_item_parts` (`id`, `user_id`, `machine_part_oem_part_nos_machine_models_id`, `machine_model_id`, `created_at`, `updated_at`) VALUES
(5, NULL, 4, 4, NULL, NULL),
(6, NULL, 5, 3, NULL, NULL),
(7, NULL, 6, 3, NULL, NULL),
(8, NULL, 7, 2, NULL, NULL),
(9, NULL, 7, 1, NULL, NULL),
(10, NULL, 8, 2, NULL, NULL),
(11, NULL, 8, 1, NULL, NULL),
(12, NULL, 9, 5, NULL, NULL),
(13, NULL, 10, 6, NULL, NULL),
(14, NULL, 11, 6, NULL, NULL),
(15, NULL, 12, 6, NULL, NULL),
(16, NULL, 13, 6, NULL, NULL),
(17, NULL, 14, 1, NULL, NULL),
(18, NULL, 15, 1, NULL, NULL),
(19, NULL, 16, 2, NULL, NULL),
(20, NULL, 16, 1, NULL, NULL),
(21, NULL, 17, 2, NULL, NULL),
(22, NULL, 17, 1, NULL, NULL),
(23, NULL, 18, 2, NULL, NULL),
(24, NULL, 18, 1, NULL, NULL),
(25, NULL, 19, 2, NULL, NULL),
(26, NULL, 19, 1, NULL, NULL),
(27, NULL, 20, 2, NULL, NULL),
(28, NULL, 20, 1, NULL, NULL),
(29, NULL, 21, 2, NULL, NULL),
(30, NULL, 21, 1, NULL, NULL),
(31, NULL, 22, 1, NULL, NULL),
(32, NULL, 22, 2, NULL, NULL),
(33, NULL, 23, 2, NULL, NULL),
(34, NULL, 23, 1, NULL, NULL),
(35, NULL, 24, 2, NULL, NULL),
(36, NULL, 24, 1, NULL, NULL),
(37, NULL, 24, 7, NULL, NULL),
(38, NULL, 25, 7, NULL, NULL),
(39, NULL, 25, 3, NULL, NULL),
(40, NULL, 25, 4, NULL, NULL),
(41, NULL, 25, 8, NULL, NULL),
(42, NULL, 26, 2, NULL, NULL),
(43, NULL, 26, 1, NULL, NULL),
(44, NULL, 26, 9, NULL, NULL),
(45, NULL, 27, 3, NULL, NULL),
(46, NULL, 28, 5, NULL, NULL),
(47, NULL, 29, 5, NULL, NULL),
(48, NULL, 30, 5, NULL, NULL),
(49, NULL, 31, 5, NULL, NULL),
(50, NULL, 32, 5, NULL, NULL),
(51, NULL, 33, 5, NULL, NULL),
(52, NULL, 34, 5, NULL, NULL),
(53, NULL, 35, 5, NULL, NULL),
(54, NULL, 36, 5, NULL, NULL),
(55, NULL, 37, 5, NULL, NULL),
(56, NULL, 38, 10, NULL, NULL),
(57, NULL, 39, 3, NULL, NULL),
(58, NULL, 40, 2, NULL, NULL),
(59, NULL, 40, 1, NULL, NULL),
(60, NULL, 40, 9, NULL, NULL),
(61, NULL, 41, 3, NULL, NULL),
(62, NULL, 42, 2, NULL, NULL),
(63, NULL, 42, 1, NULL, NULL),
(64, NULL, 43, 3, NULL, NULL),
(65, NULL, 44, 9, NULL, NULL),
(66, NULL, 45, 10, NULL, NULL),
(67, NULL, 46, 7, NULL, NULL),
(68, NULL, 46, 8, NULL, NULL),
(69, NULL, 46, 3, NULL, NULL),
(70, NULL, 46, 4, NULL, NULL),
(71, NULL, 46, 10, NULL, NULL),
(72, NULL, 47, 9, NULL, NULL),
(73, NULL, 47, 2, NULL, NULL),
(74, NULL, 47, 1, NULL, NULL),
(75, NULL, 48, 2, NULL, NULL),
(76, NULL, 48, 1, NULL, NULL),
(77, NULL, 49, 3, NULL, NULL),
(78, NULL, 50, 3, NULL, NULL),
(79, NULL, 51, 3, NULL, NULL),
(80, NULL, 52, 3, NULL, NULL),
(81, NULL, 53, 3, NULL, NULL),
(82, NULL, 54, 3, NULL, NULL),
(83, NULL, 55, 10, NULL, NULL),
(84, NULL, 55, 2, NULL, NULL),
(85, NULL, 55, 1, NULL, NULL),
(86, NULL, 55, 3, NULL, NULL),
(87, NULL, 56, 2, NULL, NULL),
(88, NULL, 56, 1, NULL, NULL),
(89, NULL, 57, 2, NULL, NULL),
(90, NULL, 57, 1, NULL, NULL),
(91, NULL, 58, 3, NULL, NULL),
(92, NULL, 59, 10, NULL, NULL),
(93, NULL, 60, 3, NULL, NULL),
(94, NULL, 61, 4, NULL, NULL),
(95, NULL, 62, 2, NULL, NULL),
(96, NULL, 62, 1, NULL, NULL),
(97, NULL, 63, 4, NULL, NULL),
(98, NULL, 64, 4, NULL, NULL),
(99, NULL, 65, 4, NULL, NULL),
(100, NULL, 66, 4, NULL, NULL),
(101, NULL, 67, 2, NULL, NULL),
(102, NULL, 67, 1, NULL, NULL),
(103, NULL, 68, 7, NULL, NULL),
(104, NULL, 68, 9, NULL, NULL),
(105, NULL, 68, 2, NULL, NULL),
(106, NULL, 68, 1, NULL, NULL),
(107, NULL, 69, 9, NULL, NULL),
(108, NULL, 69, 2, NULL, NULL),
(109, NULL, 69, 1, NULL, NULL),
(110, NULL, 69, 7, NULL, NULL),
(111, NULL, 70, 4, NULL, NULL),
(112, NULL, 70, 10, NULL, NULL),
(113, NULL, 71, 10, NULL, NULL),
(114, NULL, 71, 4, NULL, NULL),
(115, NULL, 72, 2, NULL, NULL),
(116, NULL, 72, 1, NULL, NULL),
(117, NULL, 73, 3, NULL, NULL),
(118, NULL, 74, 4, NULL, NULL),
(119, NULL, 75, 4, NULL, NULL),
(120, NULL, 76, 4, NULL, NULL),
(121, NULL, 77, 1, NULL, NULL),
(122, NULL, 78, 11, NULL, NULL),
(123, NULL, 79, 10, NULL, NULL),
(124, NULL, 79, 4, NULL, NULL),
(125, NULL, 80, 3, NULL, NULL),
(126, NULL, 80, 2, NULL, NULL),
(127, NULL, 80, 1, NULL, NULL),
(128, NULL, 81, 4, NULL, NULL),
(129, NULL, 82, 4, NULL, NULL),
(130, NULL, 83, 4, NULL, NULL),
(131, NULL, 84, 1, NULL, NULL),
(132, NULL, 85, 4, NULL, NULL),
(133, NULL, 86, 3, NULL, NULL),
(134, NULL, 87, 1, NULL, NULL),
(135, NULL, 88, 4, NULL, NULL),
(136, NULL, 89, 5, NULL, NULL),
(137, NULL, 90, 4, NULL, NULL),
(138, NULL, 91, 4, NULL, NULL),
(139, NULL, 92, 9, NULL, NULL),
(140, NULL, 92, 1, NULL, NULL),
(141, NULL, 93, 4, NULL, NULL),
(142, NULL, 94, 9, NULL, NULL),
(143, NULL, 94, 2, NULL, NULL),
(144, NULL, 95, 9, NULL, NULL),
(145, NULL, 95, 2, NULL, NULL),
(146, NULL, 96, 9, NULL, NULL),
(147, NULL, 96, 2, NULL, NULL),
(148, NULL, 97, 9, NULL, NULL),
(149, NULL, 98, 2, NULL, NULL),
(150, NULL, 99, 3, NULL, NULL),
(151, NULL, 100, 4, NULL, NULL),
(152, NULL, 101, 4, NULL, NULL),
(153, NULL, 102, 9, NULL, NULL),
(154, NULL, 102, 1, NULL, NULL),
(155, NULL, 103, 9, NULL, NULL),
(156, NULL, 103, 1, NULL, NULL),
(157, NULL, 104, 3, NULL, NULL),
(158, NULL, 105, 4, NULL, NULL),
(159, NULL, 106, 4, NULL, NULL),
(160, NULL, 107, 4, NULL, NULL),
(161, NULL, 108, 11, NULL, NULL),
(162, NULL, 109, 7, NULL, NULL),
(163, NULL, 110, 4, NULL, NULL),
(164, NULL, 111, 2, NULL, NULL),
(165, NULL, 111, 1, NULL, NULL),
(166, NULL, 111, 9, NULL, NULL),
(167, NULL, 112, 2, NULL, NULL),
(168, NULL, 112, 1, NULL, NULL),
(169, NULL, 113, 7, NULL, NULL),
(170, NULL, 114, 4, NULL, NULL),
(171, NULL, 115, 3, NULL, NULL),
(172, NULL, 116, 3, NULL, NULL),
(173, NULL, 116, 2, NULL, NULL),
(174, NULL, 117, 4, NULL, NULL),
(175, NULL, 118, 4, NULL, NULL),
(176, NULL, 119, 4, NULL, NULL),
(177, NULL, 120, 3, NULL, NULL),
(178, NULL, 121, 9, NULL, NULL),
(179, NULL, 122, 9, NULL, NULL),
(180, NULL, 123, 3, NULL, NULL),
(181, NULL, 124, 11, NULL, NULL),
(182, NULL, 125, 3, NULL, NULL),
(183, NULL, 126, 4, NULL, NULL),
(184, NULL, 127, 4, NULL, NULL),
(185, NULL, 128, 9, NULL, NULL),
(186, NULL, 128, 2, NULL, NULL),
(187, NULL, 129, 3, NULL, NULL),
(188, NULL, 130, 4, NULL, NULL),
(189, NULL, 131, 9, NULL, NULL),
(190, NULL, 131, 2, NULL, NULL),
(191, NULL, 132, 1, NULL, NULL),
(192, NULL, 132, 2, NULL, NULL),
(193, NULL, 133, 1, NULL, NULL),
(194, NULL, 133, 2, NULL, NULL),
(195, NULL, 134, 1, NULL, NULL),
(196, NULL, 135, 9, NULL, NULL),
(197, NULL, 135, 1, NULL, NULL),
(198, NULL, 136, 3, NULL, NULL),
(199, NULL, 136, 9, NULL, NULL),
(200, NULL, 136, 2, NULL, NULL),
(201, NULL, 137, 2, NULL, NULL),
(202, NULL, 137, 1, NULL, NULL),
(203, NULL, 138, 3, NULL, NULL),
(204, NULL, 139, 3, NULL, NULL),
(205, NULL, 140, 3, NULL, NULL),
(206, NULL, 141, 3, NULL, NULL),
(207, NULL, 142, 4, NULL, NULL),
(208, NULL, 143, 4, NULL, NULL),
(209, NULL, 144, 4, NULL, NULL),
(210, NULL, 145, 4, NULL, NULL),
(211, NULL, 146, 4, NULL, NULL),
(212, NULL, 147, 4, NULL, NULL),
(213, NULL, 148, 11, NULL, NULL),
(214, NULL, 149, 11, NULL, NULL),
(215, NULL, 150, 11, NULL, NULL),
(216, NULL, 151, 9, NULL, NULL),
(217, NULL, 152, 2, NULL, NULL),
(218, NULL, 152, 1, NULL, NULL),
(219, NULL, 153, 3, NULL, NULL),
(220, NULL, 153, 1, NULL, NULL),
(221, NULL, 154, 7, NULL, NULL),
(222, NULL, 155, 7, NULL, NULL),
(223, NULL, 156, 7, NULL, NULL),
(224, NULL, 157, 2, NULL, NULL),
(225, NULL, 158, 2, NULL, NULL),
(226, NULL, 159, 2, NULL, NULL),
(227, NULL, 159, 1, NULL, NULL),
(228, NULL, 160, 3, NULL, NULL),
(229, NULL, 160, 2, NULL, NULL),
(230, NULL, 160, 1, NULL, NULL),
(231, NULL, 161, 3, NULL, NULL),
(232, NULL, 161, 2, NULL, NULL),
(233, NULL, 162, 4, NULL, NULL),
(234, NULL, 163, 4, NULL, NULL),
(235, NULL, 164, 9, NULL, NULL),
(236, NULL, 164, 1, NULL, NULL),
(237, NULL, 165, 3, NULL, NULL),
(238, NULL, 166, 4, NULL, NULL),
(239, NULL, 166, 2, NULL, NULL),
(240, NULL, 166, 10, NULL, NULL),
(241, NULL, 167, 3, NULL, NULL),
(242, NULL, 167, 9, NULL, NULL),
(243, NULL, 168, 2, NULL, NULL),
(244, NULL, 168, 1, NULL, NULL),
(245, NULL, 169, 3, NULL, NULL),
(246, NULL, 170, 2, NULL, NULL),
(247, NULL, 170, 1, NULL, NULL),
(248, NULL, 171, 1, NULL, NULL),
(249, NULL, 172, 1, NULL, NULL),
(250, NULL, 173, 9, NULL, NULL),
(251, NULL, 174, 9, NULL, NULL),
(252, NULL, 175, 9, NULL, NULL),
(253, NULL, 175, 1, NULL, NULL),
(254, NULL, 176, 2, NULL, NULL),
(255, NULL, 176, 1, NULL, NULL),
(256, NULL, 176, 9, NULL, NULL),
(257, NULL, 177, 9, NULL, NULL),
(258, NULL, 177, 2, NULL, NULL),
(259, NULL, 177, 1, NULL, NULL),
(260, NULL, 178, 3, NULL, NULL),
(261, NULL, 179, 1, NULL, NULL),
(262, NULL, 180, 3, NULL, NULL),
(263, NULL, 181, 2, NULL, NULL),
(264, NULL, 182, 10, NULL, NULL),
(265, NULL, 183, 3, NULL, NULL),
(266, NULL, 184, 4, NULL, NULL),
(267, NULL, 185, 4, NULL, NULL),
(268, NULL, 186, 4, NULL, NULL),
(269, NULL, 187, 4, NULL, NULL),
(270, NULL, 188, 3, NULL, NULL),
(271, NULL, 188, 4, NULL, NULL),
(272, NULL, 188, 9, NULL, NULL),
(273, NULL, 188, 2, NULL, NULL),
(274, NULL, 188, 1, NULL, NULL),
(275, NULL, 189, 1, NULL, NULL),
(276, NULL, 190, 4, NULL, NULL),
(277, NULL, 191, 4, NULL, NULL),
(278, NULL, 192, 4, NULL, NULL),
(279, NULL, 193, 3, NULL, NULL),
(280, NULL, 194, 1, NULL, NULL),
(281, NULL, 194, 2, NULL, NULL),
(282, NULL, 195, 1, NULL, NULL),
(283, NULL, 196, 2, NULL, NULL),
(284, NULL, 196, 1, NULL, NULL),
(285, NULL, 197, 1, NULL, NULL),
(286, NULL, 197, 2, NULL, NULL),
(287, NULL, 198, 3, NULL, NULL),
(288, NULL, 199, 3, NULL, NULL),
(289, NULL, 200, 4, NULL, NULL),
(290, NULL, 201, 4, NULL, NULL),
(291, NULL, 202, 4, NULL, NULL),
(292, NULL, 203, 4, NULL, NULL),
(293, NULL, 204, 4, NULL, NULL),
(294, NULL, 205, 9, NULL, NULL),
(295, NULL, 205, 2, NULL, NULL),
(296, NULL, 205, 1, NULL, NULL),
(297, NULL, 205, 3, NULL, NULL),
(298, NULL, 206, 2, NULL, NULL),
(299, NULL, 206, 1, NULL, NULL),
(300, NULL, 207, 10, NULL, NULL),
(301, NULL, 208, 2, NULL, NULL),
(302, NULL, 209, 3, NULL, NULL),
(303, NULL, 210, 2, NULL, NULL),
(304, NULL, 210, 1, NULL, NULL),
(305, NULL, 211, 4, NULL, NULL),
(306, NULL, 212, 9, NULL, NULL),
(307, NULL, 213, 3, NULL, NULL),
(308, NULL, 214, 9, NULL, NULL),
(309, NULL, 214, 2, NULL, NULL),
(310, NULL, 214, 1, NULL, NULL),
(311, NULL, 215, 9, NULL, NULL),
(312, NULL, 215, 2, NULL, NULL),
(313, NULL, 215, 1, NULL, NULL),
(314, NULL, 216, 3, NULL, NULL),
(315, NULL, 216, 1, NULL, NULL),
(316, NULL, 217, 3, NULL, NULL),
(317, NULL, 217, 1, NULL, NULL),
(318, NULL, 218, 1, NULL, NULL),
(319, NULL, 219, 2, NULL, NULL),
(320, NULL, 219, 1, NULL, NULL),
(321, NULL, 220, 5, NULL, NULL),
(322, NULL, 221, 3, NULL, NULL),
(323, NULL, 222, 1, NULL, NULL),
(324, NULL, 223, 4, NULL, NULL),
(325, NULL, 224, 5, NULL, NULL),
(326, NULL, 225, 11, NULL, NULL),
(327, NULL, 226, 1, NULL, NULL),
(328, NULL, 227, 1, NULL, NULL),
(329, NULL, 228, 2, NULL, NULL),
(330, NULL, 228, 1, NULL, NULL),
(331, NULL, 229, 3, NULL, NULL),
(332, NULL, 230, 3, NULL, NULL),
(333, NULL, 231, 1, NULL, NULL),
(334, NULL, 232, 3, NULL, NULL),
(335, NULL, 233, 4, NULL, NULL),
(336, NULL, 234, 1, NULL, NULL),
(337, NULL, 235, 9, NULL, NULL),
(338, NULL, 236, 3, NULL, NULL),
(339, NULL, 237, 1, NULL, NULL),
(340, NULL, 238, 1, NULL, NULL),
(341, NULL, 239, 1, NULL, NULL),
(342, NULL, 240, 1, NULL, NULL),
(343, NULL, 241, 3, NULL, NULL),
(344, NULL, 242, 2, NULL, NULL),
(345, NULL, 243, 2, NULL, NULL),
(346, NULL, 244, 2, NULL, NULL),
(347, NULL, 245, 1, NULL, NULL),
(348, NULL, 245, 9, NULL, NULL),
(349, NULL, 246, 2, NULL, NULL),
(350, NULL, 247, 2, NULL, NULL),
(351, NULL, 247, 3, NULL, NULL),
(352, NULL, 248, 3, NULL, NULL),
(353, NULL, 248, 9, NULL, NULL),
(354, NULL, 248, 2, NULL, NULL),
(355, NULL, 249, 2, NULL, NULL),
(356, NULL, 250, 1, NULL, NULL),
(357, NULL, 251, 2, NULL, NULL),
(358, NULL, 252, 3, NULL, NULL),
(359, NULL, 253, 10, NULL, NULL),
(360, NULL, 254, 10, NULL, NULL),
(361, NULL, 255, 10, NULL, NULL),
(362, NULL, 256, 10, NULL, NULL),
(363, NULL, 257, 10, NULL, NULL),
(364, NULL, 258, 12, NULL, NULL),
(365, NULL, 259, 12, NULL, NULL),
(366, NULL, 260, 12, NULL, NULL),
(367, NULL, 261, 9, NULL, NULL),
(368, NULL, 261, 1, NULL, NULL),
(369, NULL, 262, 1, NULL, NULL),
(370, NULL, 263, 4, NULL, NULL),
(371, NULL, 264, 4, NULL, NULL),
(372, NULL, 265, 10, NULL, NULL),
(373, NULL, 266, 1, NULL, NULL),
(374, NULL, 267, 3, NULL, NULL),
(375, NULL, 268, 2, NULL, NULL),
(376, NULL, 269, 2, NULL, NULL),
(377, NULL, 270, 1, NULL, NULL),
(378, NULL, 271, 12, NULL, NULL),
(379, NULL, 272, 12, NULL, NULL),
(380, NULL, 273, 12, NULL, NULL),
(381, NULL, 274, 3, NULL, NULL),
(382, NULL, 275, 3, NULL, NULL),
(383, NULL, 276, 1, NULL, NULL),
(384, NULL, 277, 1, NULL, NULL),
(385, NULL, 278, 1, NULL, NULL),
(386, NULL, 279, 3, NULL, NULL),
(387, NULL, 280, 9, NULL, NULL),
(388, NULL, 281, 9, NULL, NULL),
(389, NULL, 282, 11, NULL, NULL),
(390, NULL, 283, 13, NULL, NULL),
(391, NULL, 284, 13, NULL, NULL),
(392, NULL, 285, 10, NULL, NULL),
(393, NULL, 286, 2, NULL, NULL),
(394, NULL, 287, 2, NULL, NULL),
(395, NULL, 288, 5, NULL, NULL),
(396, NULL, 289, 5, NULL, NULL),
(397, NULL, 290, 12, NULL, NULL),
(398, NULL, 291, 2, NULL, NULL),
(399, NULL, 292, 4, NULL, NULL),
(400, NULL, 293, 5, NULL, NULL),
(401, NULL, 294, 5, NULL, NULL),
(402, NULL, 295, 5, NULL, NULL),
(403, NULL, 296, 5, NULL, NULL),
(404, NULL, 297, 5, NULL, NULL),
(405, NULL, 298, 5, NULL, NULL),
(406, NULL, 299, 5, NULL, NULL),
(407, NULL, 300, 5, NULL, NULL),
(408, NULL, 301, 5, NULL, NULL),
(409, NULL, 302, 4, NULL, NULL),
(410, NULL, 303, 4, NULL, NULL),
(411, NULL, 304, 3, NULL, NULL),
(412, NULL, 305, 3, NULL, NULL),
(413, NULL, 306, 3, NULL, NULL),
(414, NULL, 307, 6, NULL, NULL),
(415, NULL, 308, 3, NULL, NULL),
(416, NULL, 308, 1, NULL, NULL),
(417, NULL, 309, 2, NULL, NULL),
(418, NULL, 310, 5, NULL, NULL),
(419, NULL, 311, 5, NULL, NULL),
(420, NULL, 312, 5, NULL, NULL),
(421, NULL, 313, 3, NULL, NULL),
(422, NULL, 314, 3, NULL, NULL),
(423, NULL, 315, 2, NULL, NULL),
(424, NULL, 316, 3, NULL, NULL),
(425, NULL, 317, 14, NULL, NULL),
(426, NULL, 318, 17, NULL, NULL),
(427, NULL, 319, 18, NULL, NULL),
(428, NULL, 320, 18, NULL, NULL),
(429, NULL, 321, 19, NULL, NULL),
(430, NULL, 322, 10, NULL, NULL),
(431, NULL, 323, 20, NULL, NULL),
(432, NULL, 324, 1, NULL, NULL),
(433, NULL, 325, 20, NULL, NULL),
(434, NULL, 326, 20, NULL, NULL),
(435, NULL, 327, 20, NULL, NULL),
(436, NULL, 328, 10, NULL, NULL),
(437, NULL, 329, 10, NULL, NULL),
(438, NULL, 330, 2, NULL, NULL),
(439, NULL, 331, 22, NULL, NULL),
(440, NULL, 332, 1, NULL, NULL),
(441, NULL, 333, 21, NULL, NULL),
(442, NULL, 334, 21, NULL, NULL),
(443, NULL, 335, 5, NULL, NULL),
(444, NULL, 336, 1, NULL, NULL),
(445, NULL, 337, 2, NULL, NULL),
(446, NULL, 338, 3, NULL, NULL),
(447, NULL, 339, 2, NULL, NULL),
(448, NULL, 340, 10, NULL, NULL),
(449, NULL, 341, 5, NULL, NULL),
(450, NULL, 342, 1, NULL, NULL),
(451, NULL, 343, 1, NULL, NULL),
(452, NULL, 344, 1, NULL, NULL),
(453, NULL, 345, 5, NULL, NULL),
(454, NULL, 346, 1, NULL, NULL),
(455, NULL, 347, 5, NULL, NULL),
(456, NULL, 348, 1, NULL, NULL),
(457, NULL, 349, 4, NULL, NULL),
(458, NULL, 350, 1, NULL, NULL),
(459, NULL, 351, 125, NULL, NULL),
(460, NULL, 352, 3, NULL, NULL),
(461, NULL, 353, 1, NULL, NULL),
(462, NULL, 354, 4, NULL, NULL),
(463, NULL, 355, 4, NULL, NULL),
(464, NULL, 356, 4, NULL, NULL),
(465, NULL, 357, 6, NULL, NULL),
(466, NULL, 358, 23, NULL, NULL),
(467, NULL, 359, 1, NULL, NULL),
(468, NULL, 360, 5, NULL, NULL),
(469, NULL, 361, 5, NULL, NULL),
(470, NULL, 362, 24, NULL, NULL),
(471, NULL, 363, 5, NULL, NULL),
(472, NULL, 364, 21, NULL, NULL),
(473, NULL, 365, 3, NULL, NULL),
(474, NULL, 366, 10, NULL, NULL),
(486, NULL, 1, 27, NULL, NULL),
(487, NULL, 2, 27, NULL, NULL),
(488, NULL, 3, 28, NULL, NULL),
(489, NULL, 367, 2, NULL, NULL),
(490, NULL, 367, 1, NULL, NULL),
(491, NULL, 367, 9, NULL, NULL),
(492, NULL, 368, 9, NULL, NULL),
(493, NULL, 368, 2, NULL, NULL),
(494, NULL, 369, 4, NULL, NULL),
(495, NULL, 370, 7, NULL, NULL),
(496, NULL, 371, 7, NULL, NULL),
(497, NULL, 372, 11, NULL, NULL),
(498, NULL, 373, 29, NULL, NULL),
(499, NULL, 374, 29, NULL, NULL),
(500, NULL, 375, 29, NULL, NULL),
(501, NULL, 376, 29, NULL, NULL),
(502, NULL, 377, 29, NULL, NULL),
(503, NULL, 378, 29, NULL, NULL),
(504, NULL, 379, 29, NULL, NULL),
(505, NULL, 380, 9, NULL, NULL),
(506, NULL, 381, 29, NULL, NULL),
(507, NULL, 381, 3, NULL, NULL),
(508, NULL, 382, 3, NULL, NULL),
(509, NULL, 383, 3, NULL, NULL),
(510, NULL, 384, 3, NULL, NULL),
(511, NULL, 385, 3, NULL, NULL),
(512, NULL, 386, 3, NULL, NULL),
(513, NULL, 387, 3, NULL, NULL),
(514, NULL, 388, 3, NULL, NULL),
(515, NULL, 389, 3, NULL, NULL),
(516, NULL, 390, 3, NULL, NULL),
(517, NULL, 391, 3, NULL, NULL),
(518, NULL, 392, 3, NULL, NULL),
(519, NULL, 393, 3, NULL, NULL),
(520, NULL, 394, 29, NULL, NULL),
(521, NULL, 395, 29, NULL, NULL),
(522, NULL, 396, 29, NULL, NULL),
(523, NULL, 397, 29, NULL, NULL),
(524, NULL, 398, 4, NULL, NULL),
(525, NULL, 399, 29, NULL, NULL),
(526, NULL, 400, 29, NULL, NULL),
(527, NULL, 401, 29, NULL, NULL),
(528, NULL, 402, 30, NULL, NULL),
(529, NULL, 403, 4, NULL, NULL),
(530, NULL, 404, 10, NULL, NULL),
(531, NULL, 405, 20, NULL, NULL),
(532, NULL, 406, 29, NULL, NULL),
(533, NULL, 407, 1, NULL, NULL),
(534, NULL, 408, 1, NULL, NULL),
(535, NULL, 409, 29, NULL, NULL),
(536, NULL, 410, 3, NULL, NULL),
(537, NULL, 411, 4, NULL, NULL),
(538, NULL, 412, 4, NULL, NULL),
(539, NULL, 413, 1, NULL, NULL),
(540, NULL, 414, 9, NULL, NULL),
(541, NULL, 415, 2, NULL, NULL),
(542, NULL, 416, 2, NULL, NULL),
(543, NULL, 417, 5, NULL, NULL),
(544, NULL, 418, 1, NULL, NULL),
(545, NULL, 419, 3, NULL, NULL),
(546, NULL, 420, 3, NULL, NULL),
(547, NULL, 421, 32, NULL, NULL),
(548, NULL, 422, 32, NULL, NULL),
(549, NULL, 423, 32, NULL, NULL),
(550, NULL, 424, 3, NULL, NULL),
(551, NULL, 425, 3, NULL, NULL),
(552, NULL, 426, 6, NULL, NULL),
(553, NULL, 427, 4, NULL, NULL),
(554, NULL, 428, 3, NULL, NULL),
(555, NULL, 429, 3, NULL, NULL),
(556, NULL, 430, 3, NULL, NULL),
(557, NULL, 431, 3, NULL, NULL),
(558, NULL, 432, 3, NULL, NULL),
(559, NULL, 433, 4, NULL, NULL),
(560, NULL, 434, 3, NULL, NULL),
(561, NULL, 435, 3, NULL, NULL),
(562, NULL, 436, 4, NULL, NULL),
(563, NULL, 437, 5, NULL, NULL),
(564, NULL, 438, 3, NULL, NULL),
(565, NULL, 438, 2, NULL, NULL),
(566, NULL, 439, 3, NULL, NULL),
(567, NULL, 440, 2, NULL, NULL),
(568, NULL, 441, 6, NULL, NULL),
(569, NULL, 442, 6, NULL, NULL),
(570, NULL, 443, 6, NULL, NULL),
(571, NULL, 444, 3, NULL, NULL),
(572, NULL, 445, 5, NULL, NULL),
(573, NULL, 446, 5, NULL, NULL),
(574, NULL, 447, 33, NULL, NULL),
(575, NULL, 448, 20, NULL, NULL),
(576, NULL, 449, 1, NULL, NULL),
(577, NULL, 450, 31, NULL, NULL),
(578, NULL, 451, 31, NULL, NULL),
(579, NULL, 452, 31, NULL, NULL),
(580, NULL, 453, 3, NULL, NULL),
(581, NULL, 453, 2, NULL, NULL),
(582, NULL, 454, 11, NULL, NULL),
(583, NULL, 455, 19, NULL, NULL),
(584, NULL, 456, 34, NULL, NULL),
(585, NULL, 457, 11, NULL, NULL),
(586, NULL, 458, 11, NULL, NULL),
(587, NULL, 459, 35, NULL, NULL),
(588, NULL, 460, 35, NULL, NULL),
(589, NULL, 461, 35, NULL, NULL),
(590, NULL, 462, 35, NULL, NULL),
(591, NULL, 463, 36, NULL, NULL),
(592, NULL, 464, 5, NULL, NULL),
(593, NULL, 465, 2, NULL, NULL),
(594, NULL, 466, 2, NULL, NULL),
(595, NULL, 467, 2, NULL, NULL),
(596, NULL, 468, 1, NULL, NULL),
(597, NULL, 468, 2, NULL, NULL),
(598, NULL, 469, 1, NULL, NULL),
(599, NULL, 470, 9, NULL, NULL),
(600, NULL, 470, 1, NULL, NULL),
(601, NULL, 471, 3, NULL, NULL),
(602, NULL, 472, 3, NULL, NULL),
(603, NULL, 473, 1, NULL, NULL),
(604, NULL, 474, 9, NULL, NULL),
(605, NULL, 475, 5, NULL, NULL),
(606, NULL, 476, 31, NULL, NULL),
(607, NULL, 477, 5, NULL, NULL),
(608, NULL, 478, 5, NULL, NULL),
(609, NULL, 479, 2, NULL, NULL),
(610, NULL, 480, 5, NULL, NULL),
(611, NULL, 481, 9, NULL, NULL),
(612, NULL, 482, 5, NULL, NULL),
(613, NULL, 483, 5, NULL, NULL),
(614, NULL, 484, 36, NULL, NULL),
(615, NULL, 484, 4, NULL, NULL),
(616, NULL, 485, 9, NULL, NULL),
(617, NULL, 486, 9, NULL, NULL),
(618, NULL, 487, 9, NULL, NULL),
(619, NULL, 488, 9, NULL, NULL),
(620, NULL, 489, 37, NULL, NULL),
(621, NULL, 490, 37, NULL, NULL),
(622, NULL, 491, 37, NULL, NULL),
(623, NULL, 492, 37, NULL, NULL),
(624, NULL, 493, 37, NULL, NULL),
(625, NULL, 494, 37, NULL, NULL),
(626, NULL, 495, 38, NULL, NULL),
(627, NULL, 496, 39, NULL, NULL),
(628, NULL, 497, 41, NULL, NULL),
(629, NULL, 498, 43, NULL, NULL),
(630, NULL, 499, 9, NULL, NULL),
(631, NULL, 499, 2, NULL, NULL),
(632, NULL, 499, 3, NULL, NULL),
(633, NULL, 500, 20, NULL, NULL),
(634, NULL, 500, 3, NULL, NULL),
(635, NULL, 500, 2, NULL, NULL),
(636, NULL, 501, 44, NULL, NULL),
(637, NULL, 502, 5, NULL, NULL),
(638, NULL, 503, 20, NULL, NULL),
(639, NULL, 504, 2, NULL, NULL),
(640, NULL, 505, 45, NULL, NULL),
(641, NULL, 506, 45, NULL, NULL),
(642, NULL, 507, 3, NULL, NULL),
(643, NULL, 508, 4, NULL, NULL),
(644, NULL, 508, 36, NULL, NULL),
(645, NULL, 509, 46, NULL, NULL),
(646, NULL, 510, 20, NULL, NULL),
(647, NULL, 511, 2, NULL, NULL),
(648, NULL, 512, 31, NULL, NULL),
(649, NULL, 513, 47, NULL, NULL),
(650, NULL, 514, 9, NULL, NULL),
(651, NULL, 514, 2, NULL, NULL),
(652, NULL, 514, 1, NULL, NULL),
(653, NULL, 515, 48, NULL, NULL),
(654, NULL, 516, 48, NULL, NULL),
(655, NULL, 517, 48, NULL, NULL),
(656, NULL, 518, 48, NULL, NULL),
(657, NULL, 519, 48, NULL, NULL),
(658, NULL, 520, 50, NULL, NULL),
(659, NULL, 521, 50, NULL, NULL),
(660, NULL, 522, 50, NULL, NULL),
(661, NULL, 523, 50, NULL, NULL),
(662, NULL, 524, 52, NULL, NULL),
(663, NULL, 525, 52, NULL, NULL),
(664, NULL, 526, 52, NULL, NULL),
(665, NULL, 527, 53, NULL, NULL),
(666, NULL, 528, 53, NULL, NULL),
(667, NULL, 529, 11, NULL, NULL),
(668, NULL, 530, 9, NULL, NULL),
(669, NULL, 531, 11, NULL, NULL),
(670, NULL, 532, 6, NULL, NULL),
(671, NULL, 533, 9, NULL, NULL),
(672, NULL, 534, 56, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `oem_part_nos`
--

CREATE TABLE `oem_part_nos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `number1` varchar(255) DEFAULT NULL,
  `number2` varchar(255) DEFAULT NULL,
  `number3` varchar(255) DEFAULT NULL,
  `number4` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oem_part_nos`
--

INSERT INTO `oem_part_nos` (`id`, `user_id`, `number1`, `number2`, `number3`, `number4`, `created_at`, `updated_at`) VALUES
(1, 3, '2440-9234', 'S130-V 70mm', NULL, NULL, '2024-07-09 08:44:34', '2024-07-09 08:44:34'),
(2, 3, 'HPV116 VALVE PLATE', NULL, NULL, NULL, '2024-07-09 09:21:17', '2024-07-09 09:21:17'),
(3, 3, 'M2X150', NULL, NULL, NULL, '2024-07-09 09:24:55', '2024-07-09 09:24:55'),
(4, 3, 'M2X150', NULL, NULL, NULL, '2024-07-09 09:27:21', '2024-07-09 09:27:21'),
(5, 3, 'A8V080', NULL, NULL, NULL, '2024-07-09 09:57:41', '2024-07-09 09:57:41'),
(6, 3, 'A8V080 KIT', NULL, NULL, NULL, '2024-07-09 09:59:57', '2024-07-09 10:07:23'),
(7, 3, 'H5V80 KIT', NULL, NULL, NULL, '2024-07-09 10:01:19', '2024-07-09 10:07:34'),
(8, 3, 'H5V80', NULL, NULL, NULL, '2024-07-09 10:02:10', '2024-07-09 10:02:10'),
(9, 3, 'FAN 24 V', NULL, NULL, NULL, '2024-07-09 10:45:57', '2024-07-09 10:45:57'),
(10, 3, 'EX-100', NULL, NULL, NULL, '2024-07-10 07:42:59', '2024-07-10 07:42:59'),
(11, 3, 'EX-100', NULL, NULL, NULL, '2024-07-10 07:43:58', '2024-07-10 07:43:58'),
(12, 3, 'EX-100', NULL, NULL, NULL, '2024-07-10 07:44:31', '2024-07-10 07:44:31'),
(13, 3, 'EX-100', NULL, NULL, NULL, '2024-07-10 07:45:11', '2024-07-10 07:45:11'),
(14, 3, '2440-9022T1', 'S130-V C/J SMALL', NULL, NULL, '2024-07-10 07:52:12', '2024-07-10 07:52:12'),
(15, 3, '2440-9022T2', 'S130-V C/J BIG', NULL, NULL, '2024-07-10 07:53:11', '2024-07-10 07:53:11'),
(16, 3, 'H3V63', NULL, NULL, NULL, '2024-07-10 07:58:55', '2024-07-10 07:58:55'),
(18, 3, 'H5V80', NULL, NULL, NULL, '2024-07-10 08:01:16', '2024-07-10 08:01:16'),
(19, 3, 'H5V80 LH', '21975', NULL, NULL, '2024-07-10 08:07:45', '2024-07-10 08:07:45'),
(20, 3, 'H5V80 LH', '17299', NULL, NULL, '2024-07-10 10:54:00', '2024-07-10 10:54:00'),
(21, 3, 'H5V80 RH', '22224', NULL, NULL, '2024-07-10 10:54:37', '2024-07-10 10:54:37'),
(22, 3, 'H5V80 RH', '58922', NULL, NULL, '2024-07-10 10:55:13', '2024-07-10 10:55:13'),
(23, 3, 'M2X63', NULL, NULL, NULL, '2024-07-10 11:03:03', '2024-07-10 11:03:03'),
(24, 3, 'M2X63', NULL, NULL, NULL, '2024-07-10 11:04:54', '2024-07-10 11:04:54'),
(25, 3, 'EX-200-1', 'WF-3052', NULL, NULL, '2024-07-10 11:47:29', '2024-07-10 11:47:29'),
(26, 3, 'WF-3051', NULL, NULL, NULL, '2024-07-10 11:50:21', '2024-07-10 11:50:21'),
(27, 3, 'DX-140', NULL, NULL, NULL, '2024-07-10 12:03:29', '2024-07-10 12:03:29'),
(28, 3, 'GRESS ADAPTER', NULL, NULL, NULL, '2024-07-10 12:18:31', '2024-07-10 12:18:31'),
(30, 3, 'HORN 24-V', NULL, NULL, NULL, '2024-07-10 12:33:06', '2024-07-10 12:33:06'),
(31, 3, 'DX-140', NULL, NULL, NULL, '2024-07-10 12:34:51', '2024-07-10 12:34:51'),
(32, 3, 'SINGLE POINT', NULL, NULL, NULL, '2024-07-10 12:36:18', '2024-07-10 12:36:18'),
(33, 3, '10-AMP', NULL, NULL, NULL, '2024-07-10 12:37:30', '2024-07-10 12:37:30'),
(34, 3, '15-AMP', NULL, NULL, NULL, '2024-07-10 12:39:09', '2024-07-10 12:39:09'),
(35, 3, 'FLASHER', NULL, NULL, NULL, '2024-07-10 12:42:58', '2024-07-10 12:42:58'),
(36, 3, 'ASSY-DX-140', NULL, NULL, NULL, '2024-07-10 12:44:54', '2024-07-10 12:44:54'),
(37, 3, 'OSAKA', NULL, NULL, NULL, '2024-07-10 13:51:36', '2024-07-10 13:51:36'),
(38, 3, 'H3V112', NULL, NULL, NULL, '2024-07-10 14:00:34', '2024-07-10 14:00:34'),
(39, 3, 'DX-140', NULL, NULL, NULL, '2024-07-10 14:09:00', '2024-07-10 14:09:00'),
(40, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-10 14:30:04', '2024-07-10 14:30:04'),
(41, 3, 'FRONT EXCEL DX-140', NULL, NULL, NULL, '2024-07-10 14:32:29', '2024-07-10 14:32:29'),
(42, 3, '32MM H5V80', NULL, NULL, NULL, '2024-07-10 14:33:29', '2024-07-10 14:33:29'),
(43, 3, 'A8V080', NULL, NULL, NULL, '2024-07-12 02:17:11', '2024-07-12 02:17:11'),
(44, 3, 'A8V86', NULL, NULL, NULL, '2024-07-12 02:18:49', '2024-07-12 02:18:49'),
(45, 3, 'H3V112', NULL, NULL, NULL, '2024-07-12 02:19:32', '2024-07-12 02:19:32'),
(46, 3, 'EX-200- 9404', 'UT-7066', NULL, NULL, '2024-07-12 02:27:48', '2024-07-12 02:27:48'),
(47, 3, 'S-130-5 -9008', NULL, NULL, NULL, '2024-07-12 02:29:15', '2024-07-12 02:29:15'),
(48, 3, 'S-130-5 9053K', NULL, NULL, NULL, '2024-07-12 02:30:54', '2024-07-12 02:30:54'),
(49, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 02:31:50', '2024-07-12 02:31:50'),
(50, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 02:34:34', '2024-07-12 02:34:34'),
(51, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 02:59:29', '2024-07-12 02:59:29'),
(52, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 03:00:05', '2024-07-12 03:00:05'),
(53, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 03:02:31', '2024-07-12 03:02:31'),
(54, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 03:03:20', '2024-07-12 03:03:20'),
(55, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 03:04:56', '2024-07-12 03:04:56'),
(56, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 03:31:23', '2024-07-12 03:31:23'),
(57, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 03:32:08', '2024-07-12 03:32:08'),
(58, 3, 'DX-140', 'FC-045', NULL, NULL, '2024-07-12 03:47:23', '2024-07-12 03:47:23'),
(59, 3, 'H3V112', NULL, NULL, NULL, '2024-07-12 03:51:43', '2024-07-12 03:51:43'),
(60, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 03:57:58', '2024-07-12 03:57:58'),
(61, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 03:58:59', '2024-07-12 03:58:59'),
(62, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 04:00:00', '2024-07-12 04:00:00'),
(63, 3, '30312', NULL, NULL, NULL, '2024-07-12 04:02:42', '2024-07-12 04:02:42'),
(64, 3, '30212', NULL, NULL, NULL, '2024-07-12 04:03:38', '2024-07-12 04:03:38'),
(65, 3, '6014', NULL, NULL, NULL, '2024-07-12 04:06:01', '2024-07-12 04:06:01'),
(66, 3, '6213', NULL, NULL, NULL, '2024-07-12 04:06:57', '2024-07-12 04:06:57'),
(67, 3, 'NUP-307E', NULL, NULL, NULL, '2024-07-12 04:07:39', '2024-07-12 04:07:39'),
(68, 3, '7030', NULL, NULL, NULL, '2024-07-12 04:12:32', '2024-07-12 04:12:32'),
(69, 3, '7530', NULL, NULL, NULL, '2024-07-12 04:13:33', '2024-07-12 04:13:33'),
(70, 3, '8530', NULL, NULL, NULL, '2024-07-12 04:14:36', '2024-07-12 04:14:36'),
(71, 3, '8030', NULL, NULL, NULL, '2024-07-12 04:15:14', '2024-07-12 04:15:14'),
(72, 3, 'H3V63', NULL, NULL, NULL, '2024-07-12 04:42:23', '2024-07-12 04:44:40'),
(73, 3, 'A8V080', NULL, NULL, NULL, '2024-07-12 04:45:16', '2024-07-12 04:45:16'),
(74, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 04:48:58', '2024-07-12 04:48:58'),
(75, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 04:49:41', '2024-07-12 04:49:41'),
(76, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 04:50:14', '2024-07-12 04:50:14'),
(77, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 04:52:04', '2024-07-12 04:52:04'),
(78, 3, 'R-1400', NULL, NULL, NULL, '2024-07-12 04:53:44', '2024-07-12 04:53:44'),
(79, 3, 'SB-81', NULL, NULL, NULL, '2024-07-12 08:01:29', '2024-07-12 08:01:29'),
(80, 3, 'SB-50', NULL, NULL, NULL, '2024-07-12 08:02:21', '2024-07-12 08:02:21'),
(81, 3, 'NPK-10XB', NULL, NULL, NULL, '2024-07-12 08:03:25', '2024-07-12 08:03:25'),
(82, 3, 'SB-70', NULL, NULL, NULL, '2024-07-12 08:04:07', '2024-07-12 08:04:07'),
(83, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 08:05:25', '2024-07-12 08:05:25'),
(84, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 08:05:56', '2024-07-12 08:05:56'),
(85, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 08:06:55', '2024-07-12 08:06:55'),
(86, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 08:08:01', '2024-07-12 08:08:01'),
(87, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 08:08:25', '2024-07-12 08:08:25'),
(88, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 08:11:13', '2024-07-12 08:11:13'),
(89, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 08:12:30', '2024-07-12 08:12:30'),
(90, 3, 'SB-70', 'SB-81', NULL, NULL, '2024-07-12 08:26:53', '2024-07-12 08:26:53'),
(91, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 13:00:47', '2024-07-12 13:00:47'),
(92, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 13:07:11', '2024-07-12 13:07:11'),
(93, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 13:09:12', '2024-07-12 13:09:12'),
(94, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 13:10:23', '2024-07-12 13:10:23'),
(95, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 13:12:04', '2024-07-12 13:12:04'),
(96, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-12 13:16:06', '2024-07-12 13:16:06'),
(97, 3, '12MM S-130-3', NULL, NULL, NULL, '2024-07-12 13:17:31', '2024-07-12 13:17:31'),
(98, 3, '10MM S140-5', NULL, NULL, NULL, '2024-07-12 13:18:39', '2024-07-12 13:18:39'),
(99, 3, 'DX-140', NULL, NULL, NULL, '2024-07-12 13:21:18', '2024-07-12 13:21:18'),
(100, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-12 13:22:18', '2024-07-12 13:22:18'),
(101, 3, '(D) EX200-1', NULL, NULL, NULL, '2024-07-12 13:23:40', '2024-07-12 13:23:40'),
(102, 3, 'S-130-5', '56*75*22', NULL, NULL, '2024-07-12 13:24:58', '2024-07-12 13:24:58'),
(103, 3, 'S-130-5', '567079B', NULL, NULL, '2024-07-12 13:26:13', '2024-07-12 13:26:13'),
(104, 3, 'dx-140', '46*65*21', NULL, NULL, '2024-07-13 04:32:36', '2024-07-13 04:32:36'),
(105, 3, '(B) EX200-1', NULL, NULL, NULL, '2024-07-13 04:34:35', '2024-07-13 04:34:35'),
(106, 3, '(S) EX200-1', NULL, NULL, NULL, '2024-07-13 04:35:13', '2024-07-13 04:35:13'),
(107, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-13 04:39:55', '2024-07-13 04:39:55'),
(108, 3, 'R-1400', '50*65*18', NULL, NULL, '2024-07-13 04:41:18', '2024-07-13 04:41:18'),
(109, 3, 'EW-130', NULL, NULL, NULL, '2024-07-13 04:42:48', '2024-07-13 04:42:48'),
(110, 3, '50-H', NULL, NULL, NULL, '2024-07-13 04:45:32', '2024-07-13 04:45:32'),
(111, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-13 06:13:12', '2024-07-13 06:13:12'),
(112, 3, 'S-130-5', '136.8*165*13', NULL, NULL, '2024-07-13 06:15:31', '2024-07-13 06:15:31'),
(113, 3, 'EW-130', '120*150*14', NULL, NULL, '2024-07-13 06:17:16', '2024-07-13 06:17:16'),
(114, 3, 'M2X150', NULL, NULL, NULL, '2024-07-13 06:19:21', '2024-07-13 06:19:21'),
(115, 3, '30*82', NULL, NULL, NULL, '2024-07-13 06:20:33', '2024-07-13 06:20:33'),
(116, 3, 'S-130-5', 'DX-140', NULL, NULL, '2024-07-13 06:24:51', '2024-07-13 06:24:51'),
(117, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-13 06:32:29', '2024-07-13 06:32:29'),
(118, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-13 06:48:42', '2024-07-13 06:48:42'),
(119, 3, 'MX-173', NULL, NULL, NULL, '2024-07-13 06:49:24', '2024-07-13 06:49:24'),
(120, 3, 'DX-140', NULL, NULL, NULL, '2024-07-13 06:49:57', '2024-07-13 06:49:57'),
(121, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-13 06:52:14', '2024-07-13 06:52:14'),
(122, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-13 06:52:48', '2024-07-13 06:52:48'),
(123, 3, 'DX-140', '150.15*178*13/16', NULL, NULL, '2024-07-13 06:53:47', '2024-07-13 06:53:47'),
(124, 3, 'R-1400', '145*175*14.5/15.5', NULL, NULL, '2024-07-13 06:54:53', '2024-07-13 06:54:53'),
(125, 3, 'DX-140', 'F-554377', NULL, NULL, '2024-07-13 06:56:33', '2024-07-13 06:56:33'),
(126, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-13 06:58:04', '2024-07-13 06:58:04'),
(127, 3, 'EX200-1', '2440-9464', NULL, NULL, '2024-07-13 06:58:45', '2024-07-13 06:58:45'),
(128, 3, 'S-130-5', '804846', NULL, NULL, '2024-07-13 07:01:58', '2024-07-13 07:01:58'),
(129, 3, 'DX-140', '801349', NULL, NULL, '2024-07-13 07:02:38', '2024-07-13 07:02:38'),
(130, 3, 'HITACHI', NULL, NULL, NULL, '2024-07-13 07:38:00', '2024-07-13 07:38:00'),
(131, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-13 07:40:01', '2024-07-13 07:40:01'),
(132, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-13 07:43:04', '2024-07-13 07:43:04'),
(133, 3, 'S-130-5', '2440-9404', NULL, NULL, '2024-07-13 07:44:09', '2024-07-13 07:44:09'),
(134, 3, 'S-130-5', '2440-9234', NULL, NULL, '2024-07-13 07:44:57', '2024-07-13 07:44:57'),
(135, 3, 'S-130-5', '2440-9452', NULL, NULL, '2024-07-13 08:05:54', '2024-07-13 08:05:54'),
(136, 3, 'S-130-5', 'WF-3055', NULL, NULL, '2024-07-13 08:15:33', '2024-07-13 08:15:33'),
(137, 3, 'S-130-5', '2440-9405', NULL, NULL, '2024-07-13 10:19:06', '2024-07-13 10:19:06'),
(138, 3, 'DX-140', 'K9002308', NULL, NULL, '2024-07-13 10:23:55', '2024-07-13 10:23:55'),
(139, 3, 'DX-140', 'K9002306', NULL, NULL, '2024-07-13 10:50:35', '2024-07-13 10:50:35'),
(140, 3, 'DX-140', 'K9002307', NULL, NULL, '2024-07-13 11:08:00', '2024-07-13 11:08:00'),
(141, 3, 'DX-140', 'ZGAQ-02922', NULL, NULL, '2024-07-13 11:09:48', '2024-07-13 11:09:48'),
(142, 3, 'EX200-1', '2440-4286', NULL, NULL, '2024-07-13 11:10:37', '2024-07-13 11:10:37'),
(143, 3, 'EX200-1', '2440-4287', NULL, NULL, '2024-07-13 11:11:08', '2024-07-13 11:11:08'),
(144, 3, 'EX200-1', '2440-4288', NULL, NULL, '2024-07-13 11:11:43', '2024-07-13 11:11:43'),
(145, 3, 'EX200-1', '2440-4286', NULL, NULL, '2024-07-13 11:15:27', '2024-07-13 11:15:27'),
(146, 3, 'EX200-1', '2440-4287', NULL, NULL, '2024-07-13 11:17:13', '2024-07-13 11:17:13'),
(147, 3, 'EX200-1', '2440-4288', NULL, NULL, '2024-07-13 11:17:50', '2024-07-13 11:17:50'),
(148, 3, 'R-1400', '31Y1-18110', NULL, NULL, '2024-07-13 11:19:38', '2024-07-13 11:19:38'),
(149, 3, 'R-1400', '31Y1-18310', NULL, NULL, '2024-07-13 11:20:16', '2024-07-13 11:20:16'),
(150, 3, 'R-1400', '31Y1-18210', NULL, NULL, '2024-07-13 11:21:38', '2024-07-13 11:21:38'),
(151, 3, 'S-130-3', '2440-9127', NULL, NULL, '2024-07-13 11:24:24', '2024-07-13 11:24:24'),
(152, 3, 'S-130-5', '2440-9233', NULL, NULL, '2024-07-13 11:26:05', '2024-07-13 11:26:05'),
(153, 3, 'S-130-5', '2440-9164', NULL, NULL, '2024-07-13 11:27:42', '2024-07-13 11:27:42'),
(154, 3, 'EW-130', '8048-11020', NULL, NULL, '2024-07-13 12:35:06', '2024-07-13 12:35:06'),
(155, 3, 'EW-130', '8048-11010', NULL, NULL, '2024-07-13 12:35:50', '2024-07-13 12:35:50'),
(156, 3, 'EW-130', '8048-11030', NULL, NULL, '2024-07-13 12:36:31', '2024-07-13 12:36:31'),
(157, 3, 'S140-5', '2440-9217', NULL, NULL, '2024-07-13 12:38:17', '2024-07-13 12:38:17'),
(158, 3, 'S140-5', '2440-9217', NULL, NULL, '2024-07-13 12:38:40', '2024-07-13 12:38:40'),
(159, 3, '37425-37625', NULL, NULL, NULL, '2024-07-13 13:06:29', '2024-07-13 13:06:29'),
(160, 3, '37431-37625', NULL, NULL, NULL, '2024-07-13 13:07:25', '2024-07-13 13:07:25'),
(161, 3, 'DX-140', 'K9003707', NULL, NULL, '2024-07-13 13:09:04', '2024-07-13 13:09:04'),
(162, 3, 'EX200-1', '2440-9469', NULL, NULL, '2024-07-13 13:10:42', '2024-07-13 13:10:42'),
(163, 3, 'EX200-1', '2440-9469', NULL, NULL, '2024-07-13 13:11:36', '2024-07-13 13:11:36'),
(164, 3, 'S-130-5', '4472 364 006', NULL, NULL, '2024-07-13 13:16:34', '2024-07-13 13:16:34'),
(165, 3, 'S/L DX-140', 'ZGAQ-03163', NULL, NULL, '2024-07-13 13:18:11', '2024-07-13 13:18:11'),
(166, 3, '110-H', NULL, NULL, NULL, '2024-07-13 13:19:27', '2024-07-13 13:19:27'),
(167, 3, '50-H', NULL, NULL, NULL, '2024-07-13 13:23:33', '2024-07-13 13:23:33'),
(168, 3, 'REAR S130-5', '4472 319 161', NULL, NULL, '2024-07-13 13:27:46', '2024-07-13 13:27:46'),
(169, 3, 'DX-140', 'K9002317', NULL, NULL, '2024-07-14 05:00:08', '2024-07-14 05:00:08'),
(170, 3, '(J) S130-5', '2440-9467', NULL, NULL, '2024-07-14 05:01:12', '2024-07-14 05:01:12'),
(171, 3, 'S-130-5 C/J SMALL', '2440-9022T1', NULL, NULL, '2024-07-14 05:04:30', '2024-07-14 05:04:30'),
(172, 3, 'S-130-5 C/J BIG', '2440-9022T2', NULL, NULL, '2024-07-14 05:05:12', '2024-07-14 05:05:12'),
(173, 3, 'S-130-3 C/J BIG', '2480-9004H2', NULL, NULL, '2024-07-14 05:06:14', '2024-07-14 05:06:14'),
(174, 3, 'S-130-3 C/J SMALL', '2480-9004H1', NULL, NULL, '2024-07-14 05:06:50', '2024-07-14 05:06:50'),
(175, 3, 'FRONT S130-5', '4472 319 157', NULL, NULL, '2024-07-14 05:09:00', '2024-07-14 05:09:00'),
(176, 3, 'S-130-5', '404-00063', NULL, NULL, '2024-07-14 05:12:42', '2024-07-14 05:12:42'),
(177, 3, 'S-130-5', '404-00064', NULL, NULL, '2024-07-14 05:13:31', '2024-07-14 05:13:31'),
(178, 3, 'DX-140', '2350-9462K', NULL, NULL, '2024-07-14 05:39:47', '2024-07-14 05:39:47'),
(179, 3, '(SMALL) S-130-5', NULL, NULL, NULL, '2024-07-14 05:43:57', '2024-07-14 05:43:57'),
(180, 3, '(SMALL) DX-140', NULL, NULL, NULL, '2024-07-14 05:44:50', '2024-07-14 05:44:50'),
(181, 3, 'S140-5', '4 GEAR', NULL, NULL, '2024-07-14 05:48:17', '2024-07-14 05:48:17'),
(182, 3, 'H3V112', NULL, NULL, NULL, '2024-07-14 06:14:56', '2024-07-14 06:14:56'),
(183, 3, 'DX-140', 'JP10049/JP10010', NULL, NULL, '2024-07-14 07:44:31', '2024-07-14 07:44:31'),
(184, 3, 'EX200-1', 'HPV116', NULL, NULL, '2024-07-14 07:47:51', '2024-07-14 07:47:51'),
(185, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-14 08:04:22', '2024-07-14 08:04:22'),
(186, 3, 'SMALL EX200-1', NULL, NULL, NULL, '2024-07-14 08:06:34', '2024-07-14 08:06:34'),
(187, 3, 'BIG EX200-1', NULL, NULL, NULL, '2024-07-14 08:07:04', '2024-07-14 08:07:04'),
(188, 3, 'EX200-1', 'S130-V', NULL, NULL, '2024-07-14 08:09:35', '2024-07-14 08:09:35'),
(189, 3, 'S-130-5', 'DB-58', NULL, NULL, '2024-07-14 08:13:19', '2024-07-14 08:13:19'),
(190, 3, 'EX200-1', '6BD1', NULL, NULL, '2024-07-14 08:13:57', '2024-07-14 08:13:57'),
(191, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-14 08:15:19', '2024-07-14 08:15:19'),
(192, 3, 'GEAR EX200-1', NULL, NULL, NULL, '2024-07-14 08:16:03', '2024-07-14 08:16:03'),
(193, 3, 'DX-140', 'K1006520', NULL, NULL, '2024-07-14 08:17:15', '2024-07-14 08:17:15'),
(194, 3, 'M2X63', '30458', NULL, NULL, '2024-07-14 08:27:57', '2024-07-14 08:27:57'),
(195, 3, 'S-130-5', 'AF-4838', NULL, NULL, '2024-07-14 08:30:15', '2024-07-14 08:30:15'),
(196, 3, 'S-130-5', 'AMC 3349', NULL, NULL, '2024-07-14 08:31:49', '2024-07-14 08:31:49'),
(197, 3, 'S-130-5', 'AMC 185', NULL, NULL, '2024-07-14 08:32:40', '2024-07-14 08:32:40'),
(198, 3, 'DX-140', '400508-00036', NULL, NULL, '2024-07-14 08:34:34', '2024-07-14 08:34:34'),
(199, 3, 'DX-140', '400403-00126', NULL, NULL, '2024-07-14 08:36:07', '2024-07-14 08:36:07'),
(200, 3, 'EX200-1', 'AMC 0707', NULL, NULL, '2024-07-14 08:37:34', '2024-07-14 08:37:34'),
(201, 3, 'EX200-1', 'AMC 1780', NULL, NULL, '2024-07-14 08:38:58', '2024-07-14 08:38:58'),
(202, 3, 'EX200-1', 'AMC 2N10', NULL, NULL, '2024-07-14 08:39:31', '2024-07-14 08:39:31'),
(203, 3, 'EX200-1', 'EXCELLENT', NULL, NULL, '2024-07-14 08:40:43', '2024-07-14 08:40:43'),
(204, 3, 'EX200-1', 'AMC 4567', NULL, NULL, '2024-07-14 08:41:22', '2024-07-14 08:41:22'),
(205, 3, 'S-130-5', 'EXCELLENT', NULL, NULL, '2024-07-14 08:42:06', '2024-07-14 08:42:06'),
(206, 3, 'H5V80', NULL, NULL, NULL, '2024-07-14 08:44:42', '2024-07-14 08:44:42'),
(207, 3, 'H3V112', NULL, NULL, NULL, '2024-07-14 09:57:46', '2024-07-14 09:57:46'),
(208, 3, 'H5V80', NULL, NULL, NULL, '2024-07-14 09:58:35', '2024-07-14 09:58:35'),
(209, 3, 'TSM72', NULL, NULL, NULL, '2024-07-14 09:59:55', '2024-07-14 09:59:55'),
(210, 3, 'M2X63', NULL, NULL, NULL, '2024-07-14 10:00:54', '2024-07-14 10:00:54'),
(211, 3, 'BIG MX173', NULL, NULL, NULL, '2024-07-14 10:01:47', '2024-07-14 10:01:47'),
(212, 3, 'A8V86', NULL, NULL, NULL, '2024-07-14 10:02:27', '2024-07-14 10:02:27'),
(213, 3, 'DX-140', NULL, NULL, NULL, '2024-07-14 10:03:32', '2024-07-14 10:03:32'),
(214, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-14 10:04:31', '2024-07-14 10:04:31'),
(215, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-14 10:05:24', '2024-07-14 10:05:24'),
(216, 3, 'BIG S130-5', NULL, NULL, NULL, '2024-07-14 10:09:40', '2024-07-14 10:09:40'),
(217, 3, 'BIG S130-5', NULL, NULL, NULL, '2024-07-14 10:11:31', '2024-07-14 10:11:31'),
(218, 3, 'SMALL S130-5', NULL, NULL, NULL, '2024-07-14 10:12:53', '2024-07-14 10:12:53'),
(219, 3, 'SMALL S130-5', NULL, NULL, NULL, '2024-07-14 10:14:08', '2024-07-14 10:14:08'),
(220, 3, 'GREEN BOX', NULL, NULL, NULL, '2024-07-14 10:15:37', '2024-07-14 10:15:37'),
(221, 3, 'S/L DX-140', NULL, NULL, NULL, '2024-07-15 16:44:46', '2024-07-15 16:44:46'),
(222, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-15 16:45:13', '2024-07-15 16:45:13'),
(223, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-15 17:17:05', '2024-07-15 17:17:05'),
(224, 3, '65*30', NULL, NULL, NULL, '2024-07-15 17:33:44', '2024-07-15 17:33:44'),
(225, 3, 'SG-04', NULL, NULL, NULL, '2024-07-15 17:35:23', '2024-07-15 17:35:23'),
(226, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-16 10:29:50', '2024-07-16 10:29:50'),
(227, 3, '35MM S130-5', NULL, NULL, NULL, '2024-07-16 10:42:59', '2024-07-16 10:42:59'),
(228, 3, '13MM S130-5', NULL, NULL, NULL, '2024-07-16 10:44:11', '2024-07-16 10:44:11'),
(229, 3, '16MM DX-140', NULL, NULL, NULL, '2024-07-16 10:44:53', '2024-07-16 10:44:53'),
(230, 3, 'DX-140', NULL, NULL, NULL, '2024-07-16 10:45:58', '2024-07-16 10:45:58'),
(231, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-16 10:46:21', '2024-07-16 10:46:21'),
(232, 3, 'DX-140', NULL, NULL, NULL, '2024-07-16 10:47:01', '2024-07-16 10:47:01'),
(233, 3, 'EX200-1', NULL, NULL, NULL, '2024-07-16 10:49:03', '2024-07-16 10:49:03'),
(234, 3, 'S-130-5', 'H3V63', NULL, NULL, '2024-07-16 10:49:40', '2024-07-16 10:49:40'),
(235, 3, 'A8V86', NULL, NULL, NULL, '2024-07-16 10:52:27', '2024-07-16 10:52:27'),
(236, 3, 'A8V080', NULL, NULL, NULL, '2024-07-16 10:52:55', '2024-07-16 10:52:55'),
(237, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-16 10:56:38', '2024-07-16 10:56:38'),
(238, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-16 10:56:59', '2024-07-16 10:56:59'),
(239, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-16 10:57:23', '2024-07-16 10:57:23'),
(240, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-16 12:34:13', '2024-07-16 12:34:13'),
(241, 3, 'DX-140', NULL, NULL, NULL, '2024-07-16 12:47:42', '2024-07-16 12:47:42'),
(242, 3, 'S140-5', NULL, NULL, NULL, '2024-07-16 13:14:43', '2024-07-16 13:14:43'),
(243, 3, '40*30', NULL, NULL, NULL, '2024-07-16 13:15:38', '2024-07-16 13:15:38'),
(244, 3, '40MM', 'S130-V', NULL, NULL, '2024-07-16 13:17:17', '2024-07-16 13:17:17'),
(245, 3, 'FRONT S130-5', '4472 319 157', NULL, NULL, '2024-07-17 08:47:10', '2024-07-17 08:47:10'),
(246, 3, '71*19 S130-5', NULL, NULL, NULL, '2024-07-17 08:54:51', '2024-07-17 08:54:51'),
(247, 3, '71*86*80', NULL, NULL, NULL, '2024-07-17 09:01:41', '2024-07-17 09:01:41'),
(248, 3, '71*9', NULL, NULL, NULL, '2024-07-17 09:02:51', '2024-07-17 09:02:51'),
(249, 3, '35MM S-130-5', NULL, NULL, NULL, '2024-07-17 09:08:16', '2024-07-17 09:08:16'),
(250, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-17 09:10:12', '2024-07-17 09:10:12'),
(251, 3, '65*80*65', NULL, NULL, NULL, '2024-07-17 09:11:26', '2024-07-17 09:11:26'),
(252, 3, '71*86*90', NULL, NULL, NULL, '2024-07-18 10:51:50', '2024-07-18 10:51:50'),
(253, 3, 'S-225', NULL, NULL, NULL, '2024-07-18 10:58:09', '2024-07-18 10:58:09'),
(254, 3, 'S-225', NULL, NULL, NULL, '2024-07-18 10:58:46', '2024-07-18 10:58:46'),
(255, 3, 'S-225', NULL, NULL, NULL, '2024-07-18 10:59:34', '2024-07-18 10:59:34'),
(256, 3, 'S-225', NULL, NULL, NULL, '2024-07-18 11:00:04', '2024-07-18 11:00:04'),
(257, 3, 'H3V112', NULL, NULL, NULL, '2024-07-18 11:30:01', '2024-07-18 11:30:01'),
(258, 3, 'FH-200', NULL, NULL, NULL, '2024-07-18 11:42:36', '2024-07-18 11:42:36'),
(259, 3, 'FH-200', NULL, NULL, NULL, '2024-07-18 11:43:14', '2024-07-18 11:43:14'),
(260, 3, 'FH-200', NULL, NULL, NULL, '2024-07-18 11:44:02', '2024-07-18 11:44:02'),
(261, 3, 'A6V115', NULL, NULL, NULL, '2024-07-18 11:45:56', '2024-07-18 11:45:56'),
(262, 3, '804846', NULL, NULL, NULL, '2024-07-18 11:56:51', '2024-07-18 11:56:51'),
(263, 3, 'AP-3055', NULL, NULL, NULL, '2024-07-20 09:37:19', '2024-07-20 09:37:19'),
(264, 3, 'AW-3055', NULL, NULL, NULL, '2024-07-20 09:37:44', '2024-07-20 09:37:44'),
(265, 3, 'S-225', 'BLACK', NULL, NULL, '2024-07-20 09:47:38', '2024-07-20 09:47:38'),
(266, 3, '3STEP 13MM', 'S130-V', NULL, NULL, '2024-07-20 10:02:59', '2024-07-20 10:02:59'),
(267, 3, '2STEP 16MM', 'DX-140', NULL, NULL, '2024-07-20 10:03:49', '2024-07-20 10:03:49'),
(268, 3, '45MM S130-5', NULL, NULL, NULL, '2024-07-20 10:16:15', '2024-07-20 10:16:15'),
(269, 3, '45*30', NULL, NULL, NULL, '2024-07-20 10:16:46', '2024-07-20 10:16:46'),
(270, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-20 10:21:23', '2024-07-20 10:21:23'),
(271, 3, 'FH-200', NULL, NULL, NULL, '2024-07-20 10:27:38', '2024-07-20 10:27:38'),
(272, 3, 'FH-200', NULL, NULL, NULL, '2024-07-20 10:28:50', '2024-07-20 10:28:50'),
(273, 3, 'FH-200', NULL, NULL, NULL, '2024-07-20 10:29:16', '2024-07-20 10:29:16'),
(274, 3, 'DX-140', NULL, NULL, NULL, '2024-07-20 10:45:19', '2024-07-20 10:45:19'),
(275, 3, 'DX-140', NULL, NULL, NULL, '2024-07-20 10:45:57', '2024-07-20 10:45:57'),
(276, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-20 10:55:22', '2024-07-20 10:55:22'),
(277, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-20 10:55:51', '2024-07-20 10:55:51'),
(278, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-20 10:56:15', '2024-07-20 10:56:15'),
(279, 3, 'DX-140', NULL, NULL, NULL, '2024-07-20 10:56:38', '2024-07-20 10:56:38'),
(280, 3, 'SMALL C/J S130-3', NULL, NULL, NULL, '2024-07-20 11:02:35', '2024-07-20 11:02:35'),
(281, 3, 'BIG C/J S130-3', NULL, NULL, NULL, '2024-07-20 11:03:28', '2024-07-20 11:03:28'),
(282, 3, 'R-1400', NULL, NULL, NULL, '2024-07-20 11:12:39', '2024-07-20 11:12:39'),
(283, 3, 'S80-2', NULL, NULL, NULL, '2024-07-20 11:13:23', '2024-07-20 11:13:23'),
(284, 3, 'S80-2', NULL, NULL, NULL, '2024-07-20 11:13:51', '2024-07-20 11:13:51'),
(285, 3, 'S-225', NULL, NULL, NULL, '2024-07-20 11:23:18', '2024-07-20 11:23:18'),
(286, 3, '70*90*7', NULL, NULL, NULL, '2024-07-20 11:24:56', '2024-07-20 11:24:56'),
(287, 3, '80*110*11', NULL, NULL, NULL, '2024-07-20 11:25:31', '2024-07-20 11:25:31'),
(288, 3, 'S-130-5', 'DX-140', NULL, NULL, '2024-07-20 11:45:05', '2024-07-20 11:45:05'),
(289, 3, '105*30', NULL, NULL, NULL, '2024-07-20 11:52:35', '2024-07-20 11:52:35'),
(290, 3, '318MM', NULL, NULL, NULL, '2024-07-20 11:59:17', '2024-07-20 11:59:17'),
(291, 3, '35*30', NULL, NULL, NULL, '2024-07-20 12:03:42', '2024-07-20 12:03:42'),
(292, 3, 'SB-70', NULL, NULL, NULL, '2024-07-20 12:53:34', '2024-07-20 12:53:34'),
(293, 3, '20W-50', NULL, NULL, NULL, '2024-07-20 12:58:38', '2024-07-20 12:58:38'),
(294, 3, 'BAG', NULL, NULL, NULL, '2024-07-20 13:08:30', '2024-07-20 13:08:30'),
(295, 3, 'LLA-257', NULL, NULL, NULL, '2024-07-20 13:19:13', '2024-07-20 13:19:13'),
(296, 3, 'SMO-20', NULL, NULL, NULL, '2024-07-20 13:20:18', '2024-07-20 13:20:18'),
(297, 3, 'MPF-35829', NULL, NULL, NULL, '2024-07-20 13:21:27', '2024-07-20 13:21:27'),
(298, 3, 'MITSUBISHI', NULL, NULL, NULL, '2024-07-20 13:26:37', '2024-07-20 13:26:37'),
(299, 3, '85GM', NULL, NULL, NULL, '2024-07-22 11:02:17', '2024-07-22 11:02:17'),
(300, 3, '60GM', NULL, NULL, NULL, '2024-07-22 11:03:02', '2024-07-22 11:03:02'),
(301, 3, '25GM', NULL, NULL, NULL, '2024-07-22 11:03:38', '2024-07-22 11:03:38'),
(302, 3, 'EX200-1', '19 TEETH', NULL, NULL, '2024-07-22 11:07:29', '2024-07-22 11:07:29'),
(303, 3, 'EX200-1', '14 TEETH', NULL, NULL, '2024-07-22 11:08:35', '2024-07-22 11:08:35'),
(304, 3, 'TSM72', NULL, NULL, NULL, '2024-07-22 11:11:23', '2024-07-22 11:11:23'),
(305, 3, 'TSM72', NULL, NULL, NULL, '2024-07-22 11:12:12', '2024-07-22 11:12:12'),
(306, 3, 'TSM72', NULL, NULL, NULL, '2024-07-22 11:15:24', '2024-07-22 11:15:24'),
(307, 3, 'EX-100', NULL, NULL, NULL, '2024-07-22 13:30:23', '2024-07-22 13:30:23'),
(308, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-22 13:31:28', '2024-07-22 13:31:28'),
(309, 3, 'S-130-5', NULL, NULL, NULL, '2024-07-25 13:40:41', '2024-07-25 13:40:41'),
(310, 3, '60*30', NULL, NULL, NULL, '2024-07-27 07:58:32', '2024-07-27 07:58:32'),
(311, 3, '95*30', NULL, NULL, NULL, '2024-07-27 07:59:15', '2024-07-27 07:59:15'),
(312, 3, '80MM', NULL, NULL, NULL, '2024-07-27 08:00:33', '2024-07-27 08:00:33'),
(313, 3, 'DX-140', NULL, NULL, NULL, '2024-07-28 13:34:14', '2024-07-28 13:34:14'),
(314, 3, 'A6VM107', NULL, NULL, NULL, '2024-07-28 13:34:49', '2024-07-28 13:34:49'),
(315, 3, 'H5V80', NULL, NULL, NULL, '2024-07-28 13:35:41', '2024-07-28 13:35:41'),
(316, 3, 'GM18VL-J', 'DX-140', NULL, NULL, '2024-07-28 13:37:07', '2024-07-28 13:37:07'),
(321, 3, 'UHO7-7', NULL, NULL, NULL, '2024-08-03 09:17:36', '2024-08-03 09:17:36'),
(322, 3, 'S-225', NULL, NULL, NULL, '2024-08-03 09:39:16', '2024-08-03 09:39:16'),
(323, 3, 'DX-225', NULL, NULL, NULL, '2024-08-03 09:40:22', '2024-08-03 09:40:22'),
(324, 3, 'M2X63', NULL, NULL, NULL, '2024-08-03 09:41:03', '2024-08-03 09:41:03'),
(325, 3, 'DX-225', NULL, NULL, NULL, '2024-08-05 07:02:35', '2024-08-05 07:02:35'),
(326, 3, 'DX-225', NULL, NULL, NULL, '2024-08-05 07:03:01', '2024-08-05 07:03:01'),
(327, 3, 'DX-225', NULL, NULL, NULL, '2024-08-05 07:03:37', '2024-08-05 07:03:37'),
(328, 3, 'H3V112', NULL, NULL, NULL, '2024-08-05 07:04:27', '2024-08-05 07:04:27'),
(329, 3, 'H3V112', '4B', NULL, NULL, '2024-08-05 07:05:02', '2024-08-05 07:05:02'),
(330, 3, 'S-130-5', NULL, NULL, NULL, '2024-08-05 07:16:04', '2024-08-05 07:16:04'),
(331, 3, 'EX200-5', NULL, NULL, NULL, '2024-08-05 09:33:11', '2024-08-05 09:33:11'),
(332, 3, 'S-130-5', NULL, NULL, NULL, '2024-08-05 09:35:08', '2024-08-05 09:35:08'),
(333, 6, '11N8-70110-AS', 'LF3970', NULL, NULL, '2024-08-06 06:27:36', '2024-08-06 06:27:36'),
(334, 6, '11N8-70110-AS', 'LF3970', NULL, NULL, '2024-08-06 07:10:46', '2024-08-06 07:10:46'),
(335, 3, '120-3', NULL, NULL, NULL, '2024-08-07 05:08:40', '2024-08-07 05:08:40'),
(336, 3, 'H3V63', NULL, NULL, NULL, '2024-08-07 05:09:35', '2024-08-07 05:09:35'),
(337, 3, 'A6V115', NULL, NULL, NULL, '2024-08-07 05:10:16', '2024-08-07 05:10:16'),
(338, 3, 'A6VM107', NULL, NULL, NULL, '2024-08-07 05:10:49', '2024-08-07 05:10:49'),
(339, 3, 'H5V80', NULL, NULL, NULL, '2024-08-07 06:17:10', '2024-08-07 06:17:10'),
(340, 3, 'H3V112', NULL, NULL, NULL, '2024-08-07 06:18:00', '2024-08-07 06:18:00'),
(341, 3, '75MM', NULL, NULL, NULL, '2024-08-07 06:37:18', '2024-08-07 06:37:18'),
(342, 3, 'H5V80', NULL, NULL, NULL, '2024-08-07 09:45:37', '2024-08-07 09:45:37'),
(343, 3, 'H5V80', NULL, NULL, NULL, '2024-08-07 09:46:17', '2024-08-07 09:46:17'),
(344, 3, 'FRONT S130-5', NULL, NULL, NULL, '2024-08-07 09:46:56', '2024-08-07 09:46:56'),
(345, 3, 'SB-70', NULL, NULL, NULL, '2024-08-07 09:55:27', '2024-08-07 09:55:27'),
(346, 3, 'S-130-5', NULL, NULL, NULL, '2024-08-07 10:36:27', '2024-08-07 10:36:27'),
(347, 3, 'RANDOM JACK', NULL, NULL, NULL, '2024-08-07 10:44:19', '2024-08-07 10:44:19'),
(348, 3, 'HPV116', NULL, NULL, NULL, '2024-08-07 12:38:04', '2024-08-07 12:38:04'),
(349, 3, 'HPV116', NULL, NULL, NULL, '2024-08-07 12:39:34', '2024-08-07 12:39:34'),
(350, 3, 'S-130-3', NULL, NULL, NULL, '2024-08-07 12:44:27', '2024-08-07 12:44:27'),
(351, NULL, 'Water Jacket Local', NULL, NULL, NULL, '2024-08-07 12:44:56', '2024-08-07 12:44:56'),
(352, 3, 'TSM72', NULL, NULL, NULL, '2024-08-07 12:47:31', '2024-08-07 12:47:31'),
(353, 3, 'M2X63', 'K-TYPE', NULL, NULL, '2024-08-07 12:48:55', '2024-08-07 12:48:55'),
(354, 3, 'HPV116', NULL, NULL, NULL, '2024-08-07 12:53:44', '2024-08-07 12:53:44'),
(355, 3, 'HPV116', NULL, NULL, NULL, '2024-08-07 12:56:53', '2024-08-07 12:56:53'),
(356, 3, 'HPV116', NULL, NULL, NULL, '2024-08-07 13:04:19', '2024-08-07 13:04:19'),
(357, 3, 'A8V55', NULL, NULL, NULL, '2024-08-07 13:50:37', '2024-08-07 13:50:37'),
(358, 3, 'M2X-210', NULL, NULL, NULL, '2024-08-08 10:34:05', '2024-08-08 10:34:05'),
(359, 3, 'H5V80', NULL, NULL, NULL, '2024-08-08 10:57:00', '2024-08-08 10:57:00'),
(360, 3, 'UNIVERSAL', NULL, NULL, NULL, '2024-08-11 07:00:54', '2024-08-11 07:00:54'),
(361, 3, 'UNIVERSAL', NULL, NULL, NULL, '2024-08-11 07:02:58', '2024-08-11 07:02:58'),
(362, 3, 'S-170', NULL, NULL, NULL, '2024-08-11 13:40:10', '2024-08-11 13:40:10'),
(363, 3, '85*40', NULL, NULL, NULL, '2024-08-11 13:41:14', '2024-08-11 13:41:14'),
(364, 6, 'HAV2399', NULL, NULL, NULL, '2024-08-12 09:48:16', '2024-08-12 09:48:16'),
(365, 3, 'TSM72', NULL, NULL, NULL, '2024-08-17 10:49:44', '2024-08-17 10:49:44'),
(366, 3, 'H3V112', NULL, NULL, NULL, '2024-08-17 10:52:58', '2024-08-17 10:52:58'),
(367, 8, '333', '444', NULL, NULL, '2024-08-22 10:46:21', '2024-08-22 10:46:21'),
(368, 8, '22', '25', NULL, NULL, '2024-08-23 11:13:40', '2024-08-23 11:13:40'),
(369, 10, '77845ddf-96', '42258dsddd', NULL, NULL, '2024-08-26 06:50:25', '2024-08-26 06:50:25'),
(370, 10, '6633558', '21548488', NULL, NULL, '2024-08-26 06:51:49', '2024-08-26 06:51:49'),
(371, 8, '7887', '7', NULL, NULL, '2024-08-28 07:00:37', '2024-08-28 07:00:37'),
(372, 11, 'dew', '44', NULL, NULL, '2024-08-28 08:22:58', '2024-08-28 08:22:58'),
(373, 11, '55bhhg', 'ghgyyf', NULL, NULL, '2024-08-28 08:45:18', '2024-08-28 08:45:18'),
(374, 11, '45645', '456', NULL, NULL, '2024-08-28 09:23:59', '2024-08-28 09:23:59'),
(375, 11, '43ffffffffffff', '33', NULL, NULL, '2024-08-28 10:05:58', '2024-08-28 10:05:58'),
(376, 11, '456', NULL, NULL, NULL, '2024-08-28 11:28:45', '2024-08-28 11:28:45'),
(377, 8, 'iiii', 'fgfgh', NULL, NULL, '2024-08-28 11:35:48', '2024-08-28 11:35:48'),
(378, 11, '4', '43', NULL, NULL, '2024-08-28 12:16:32', '2024-08-28 12:16:32'),
(379, 11, 'ffd', NULL, NULL, NULL, '2024-08-29 06:48:14', '2024-08-29 06:48:14'),
(380, 11, '444500hj', '25jnnjhj', NULL, NULL, '2024-08-29 09:02:20', '2024-08-29 09:02:20'),
(381, 13, '1558854588', '3232262962', NULL, NULL, '2024-08-30 10:56:21', '2024-08-30 10:56:21'),
(382, 3, 'S-130-5', NULL, NULL, NULL, '2024-09-03 07:57:53', '2024-09-03 07:57:53'),
(383, 3, 'S-130-5', NULL, NULL, NULL, '2024-09-03 11:35:18', '2024-09-03 11:35:18'),
(384, 3, 'EX200-1', NULL, NULL, NULL, '2024-09-04 08:03:06', '2024-09-04 08:03:06'),
(385, 3, 'BIG EW-130', NULL, NULL, NULL, '2024-09-07 13:05:39', '2024-09-07 13:05:39'),
(386, 3, 'SMALL EW-130', NULL, NULL, NULL, '2024-09-07 13:06:26', '2024-09-07 13:06:26'),
(387, 3, 'R-1400', NULL, NULL, NULL, '2024-09-07 13:12:34', '2024-09-07 13:12:34'),
(388, 3, 'EW-170', '55*72*12', NULL, NULL, '2024-09-08 05:40:56', '2024-09-08 05:40:56'),
(389, 3, 'EW-170', NULL, NULL, NULL, '2024-09-08 05:45:27', '2024-09-08 05:45:27'),
(390, 3, 'EW-170', '140*170*14.5', NULL, NULL, '2024-09-09 11:50:03', '2024-09-09 11:50:03'),
(391, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 11:50:38', '2024-09-09 11:50:38'),
(392, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 11:51:12', '2024-09-09 11:51:12'),
(393, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 11:51:48', '2024-09-09 11:51:48'),
(394, 3, '70*40', NULL, NULL, NULL, '2024-09-09 11:52:30', '2024-09-09 11:52:30'),
(395, 3, 'PL-1 OLD MODEL', 'S130-3', NULL, NULL, '2024-09-09 12:00:23', '2024-09-09 12:00:23'),
(396, 3, 'EW-170', 'DX-140', NULL, NULL, '2024-09-09 12:21:15', '2024-09-09 12:21:15'),
(397, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:28:26', '2024-09-09 12:28:26'),
(399, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:30:58', '2024-09-09 12:30:58'),
(400, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:31:41', '2024-09-09 12:31:41'),
(401, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:32:11', '2024-09-09 12:32:11'),
(402, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:33:37', '2024-09-09 12:33:37'),
(403, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:34:21', '2024-09-09 12:34:21'),
(404, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:35:21', '2024-09-09 12:35:21'),
(405, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:35:48', '2024-09-09 12:35:48'),
(406, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:46:03', '2024-09-09 12:46:03'),
(407, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:46:31', '2024-09-09 12:46:31'),
(408, 3, 'TSM72', NULL, NULL, NULL, '2024-09-09 12:50:12', '2024-09-09 12:50:12'),
(409, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 13:22:28', '2024-09-09 13:22:28'),
(410, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 13:23:06', '2024-09-09 13:23:06'),
(411, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 13:24:47', '2024-09-09 13:24:47'),
(412, 3, 'EW-170', NULL, NULL, NULL, '2024-09-09 13:36:29', '2024-09-09 13:36:29'),
(413, 3, 'EX200-1', NULL, NULL, NULL, '2024-09-09 13:37:35', '2024-09-09 13:37:35'),
(414, 3, 'EW-170', NULL, NULL, NULL, '2024-09-10 06:08:41', '2024-09-10 06:08:41'),
(415, 3, 'EW-170', NULL, NULL, NULL, '2024-09-10 06:10:43', '2024-09-10 06:10:43'),
(416, 3, 'EW-170', NULL, NULL, NULL, '2024-09-10 06:11:54', '2024-09-10 06:11:54'),
(417, 3, 'JCB-200', NULL, NULL, NULL, '2024-09-11 10:54:28', '2024-09-11 10:54:28'),
(418, 3, 'EX200-1', NULL, NULL, NULL, '2024-09-11 10:55:09', '2024-09-11 10:55:09'),
(419, 3, 'S-225', NULL, NULL, NULL, '2024-09-11 10:55:50', '2024-09-11 10:55:50'),
(420, 3, 'DX-225', NULL, NULL, NULL, '2024-09-11 10:58:13', '2024-09-11 10:58:13'),
(421, 3, 'EW-170', NULL, NULL, NULL, '2024-09-11 11:00:40', '2024-09-11 11:00:40'),
(422, 3, 'S-130-5', NULL, NULL, NULL, '2024-09-11 11:17:29', '2024-09-11 11:17:29'),
(423, 3, '1115*3', 'H5V80 HEAD RING', NULL, NULL, '2024-09-11 11:19:07', '2024-09-11 11:19:07'),
(424, 3, 'EW-170', NULL, NULL, NULL, '2024-09-11 11:19:43', '2024-09-11 11:19:43'),
(425, 3, 'DX-140', NULL, NULL, NULL, '2024-09-11 11:20:41', '2024-09-11 11:20:41'),
(426, 3, 'HPV116', NULL, NULL, NULL, '2024-09-11 11:21:27', '2024-09-11 11:21:27'),
(427, 3, 'HPV116', NULL, NULL, NULL, '2024-09-11 11:23:48', '2024-09-11 11:23:48'),
(428, 3, 'H3V63', NULL, NULL, NULL, '2024-09-11 11:28:35', '2024-09-11 11:28:35'),
(429, 3, 'A8V86', NULL, NULL, NULL, '2024-09-11 11:29:19', '2024-09-11 11:29:19'),
(430, 3, 'FRONT S140-5', NULL, NULL, NULL, '2024-09-14 13:07:59', '2024-09-14 13:07:59'),
(431, 3, 'S-140-5', NULL, NULL, NULL, '2024-09-14 13:23:56', '2024-09-14 13:23:56'),
(432, 3, 'NPK-7XB', NULL, NULL, NULL, '2024-09-15 11:18:39', '2024-09-15 11:18:39'),
(433, 3, 'S-130-5', NULL, NULL, NULL, '2024-09-19 08:58:14', '2024-09-19 08:58:14'),
(434, 3, 'A6VM107', NULL, NULL, NULL, '2024-09-19 09:22:55', '2024-09-19 09:22:55'),
(435, 3, 'A8V080', NULL, NULL, NULL, '2024-09-19 09:23:24', '2024-09-19 09:23:24'),
(436, 3, 'HPV145', NULL, NULL, NULL, '2024-09-19 11:16:12', '2024-09-19 11:16:12'),
(437, 3, 'HPV145', NULL, NULL, NULL, '2024-09-19 11:16:58', '2024-09-19 11:16:58'),
(438, 3, 'HPV145', NULL, NULL, NULL, '2024-09-19 11:17:29', '2024-09-19 11:17:29'),
(439, 3, 'DX-140', NULL, NULL, NULL, '2024-09-19 11:22:10', '2024-09-19 11:22:10'),
(440, 3, '30209', 'DX-140 SMALL', NULL, NULL, '2024-09-19 11:28:12', '2024-09-19 11:28:12'),
(441, 3, 'EX-100', NULL, NULL, NULL, '2024-09-19 14:43:25', '2024-09-19 14:43:25'),
(442, 3, 'EX200-1', NULL, NULL, NULL, '2024-09-19 14:48:13', '2024-09-19 14:48:13'),
(443, 3, 'LH-A8VO80', NULL, NULL, NULL, '2024-09-21 04:56:54', '2024-09-21 04:56:54'),
(444, 3, 'RH-A8VO80', NULL, NULL, NULL, '2024-09-21 04:57:31', '2024-09-21 04:57:31'),
(445, 3, 'A8V080', NULL, NULL, NULL, '2024-09-21 05:38:04', '2024-09-21 05:38:04'),
(446, 3, 'A8V080', NULL, NULL, NULL, '2024-09-21 05:38:38', '2024-09-21 05:38:38'),
(447, 3, 'A8V080', NULL, NULL, NULL, '2024-09-21 05:41:00', '2024-09-21 05:41:00'),
(448, 3, 'EX200-1', NULL, NULL, NULL, '2024-09-22 04:38:03', '2024-09-22 04:38:03'),
(449, 3, 'REAR-DX-140', NULL, NULL, NULL, '2024-09-22 04:41:14', '2024-09-22 04:41:14'),
(450, 3, 'D/L-DX-140', NULL, NULL, NULL, '2024-09-22 04:43:11', '2024-09-22 04:43:11'),
(451, 3, 'B-47', NULL, NULL, NULL, '2024-09-22 04:47:33', '2024-09-22 04:47:33'),
(452, 3, 'OIL', NULL, NULL, NULL, '2024-09-22 04:58:49', '2024-09-22 04:58:49'),
(453, 3, 'S-140-5', NULL, NULL, NULL, '2024-09-22 06:35:51', '2024-09-22 06:35:51'),
(454, 3, 'DX-140', NULL, NULL, NULL, '2024-09-23 12:56:07', '2024-09-23 12:56:07'),
(455, 3, 'HALF-S130-5', NULL, NULL, NULL, '2024-09-23 13:10:18', '2024-09-23 13:10:18'),
(456, 3, 'BIG-EX-100', '21319RHRW33/700603', NULL, NULL, '2024-09-24 05:20:56', '2024-09-24 05:20:56'),
(457, 3, 'SMALL-EX-100', '22216RHRW33/C0102', NULL, NULL, '2024-09-24 05:22:09', '2024-09-24 05:22:09'),
(458, 3, 'EX-100', 'TAY-180*210*16/18', NULL, NULL, '2024-09-24 05:27:30', '2024-09-24 05:27:30'),
(459, 3, 'RING+SEAL', 'DX-140', NULL, NULL, '2024-09-24 12:07:00', '2024-09-24 12:07:00'),
(460, 3, '30MM', NULL, NULL, NULL, '2024-09-24 12:07:35', '2024-09-24 12:07:35'),
(461, 3, '30*30', NULL, NULL, NULL, '2024-09-24 12:08:03', '2024-09-24 12:08:03'),
(462, 3, 'ZX-200', NULL, NULL, NULL, '2024-09-24 12:08:51', '2024-09-24 12:08:51'),
(463, 3, 'DX-210', NULL, NULL, NULL, '2024-09-24 12:17:22', '2024-09-24 12:17:22'),
(464, 3, 'WHEEL-S-130-5', NULL, NULL, NULL, '2024-09-24 12:59:14', '2024-09-24 12:59:14'),
(465, 3, '55*35', NULL, NULL, NULL, '2024-09-25 05:41:30', '2024-09-25 05:41:30'),
(466, 3, '55MM', NULL, NULL, NULL, '2024-09-25 05:42:06', '2024-09-25 05:42:06'),
(467, 3, 'NUP-205E', NULL, NULL, NULL, '2024-09-25 06:15:55', '2024-09-25 06:15:55'),
(468, 3, 'S-140-5', NULL, NULL, NULL, '2024-09-25 06:31:21', '2024-09-25 06:31:21'),
(469, 3, 'R-1400', NULL, NULL, NULL, '2024-09-25 12:14:22', '2024-09-25 12:14:22'),
(470, 3, 'UHO 7-7', NULL, NULL, NULL, '2024-09-26 14:03:20', '2024-09-26 14:03:20'),
(471, 3, 'VOE1292404', 'UT6091', NULL, NULL, '2024-10-02 12:28:40', '2024-10-02 12:28:40'),
(472, 3, 'XKBH-01969', 'UT4219', NULL, NULL, '2024-10-02 12:36:23', '2024-10-02 12:36:23'),
(473, 3, 'ZTAM-00509A', 'ZTAM-00509A', NULL, NULL, '2024-10-02 12:56:48', '2024-10-02 12:56:48'),
(474, 3, '322206-J', NULL, NULL, NULL, '2024-10-02 13:02:00', '2024-10-02 13:02:00'),
(475, 3, 'AP2D21', '17MM', NULL, NULL, '2024-10-03 05:04:48', '2024-10-03 05:04:48'),
(476, 3, 'AP2D21', '17MM', NULL, NULL, '2024-10-03 05:06:05', '2024-10-03 05:06:05'),
(477, 3, 'AP2D21', '17MM', NULL, NULL, '2024-10-03 05:06:40', '2024-10-03 05:06:40'),
(478, 3, 'EX-270', NULL, NULL, NULL, '2024-10-09 12:43:30', '2024-10-09 12:43:30'),
(479, 3, '75-6', NULL, NULL, NULL, '2024-10-10 13:13:03', '2024-10-10 13:13:03'),
(480, 3, '34*98', 'HISA CROSS', NULL, NULL, '2024-10-10 13:59:11', '2024-10-10 13:59:11'),
(481, 3, '31308-JR', 'HISA BERING', NULL, NULL, '2024-10-10 14:02:46', '2024-10-10 14:02:46'),
(482, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-10 14:05:02', '2024-10-10 14:05:02'),
(483, 3, '60*90*12', 'HISA SEAL', NULL, NULL, '2024-10-10 14:07:58', '2024-10-10 14:07:58'),
(484, 3, 'DB58', 'TIMING SEAL', NULL, NULL, '2024-10-10 14:10:28', '2024-10-10 14:10:28'),
(485, 3, 'HALF S-130-5', NULL, NULL, NULL, '2024-10-12 07:28:48', '2024-10-12 07:28:48'),
(486, 3, 'SB-50', NULL, NULL, NULL, '2024-10-12 07:50:54', '2024-10-12 07:50:54'),
(487, 3, 'DX-140', NULL, NULL, NULL, '2024-10-12 12:05:00', '2024-10-12 12:05:00'),
(488, 3, 'S-130-5', 'CHAINA', NULL, NULL, '2024-10-12 12:08:46', '2024-10-12 12:08:46'),
(489, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-12 13:16:57', '2024-10-12 13:16:57'),
(490, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-12 13:18:55', '2024-10-12 13:18:55'),
(491, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-12 13:22:25', '2024-10-12 13:22:25'),
(492, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-12 13:28:19', '2024-10-12 13:28:19'),
(493, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-12 13:29:23', '2024-10-12 13:29:23'),
(494, 3, 'S-130-5', '1290', NULL, NULL, '2024-10-12 13:31:27', '2024-10-12 13:31:27'),
(495, 3, 'CLUMP', NULL, NULL, NULL, '2024-10-12 13:32:37', '2024-10-12 13:32:37'),
(496, 3, 'PUMP A8V86', '42*62*7', NULL, NULL, '2024-10-13 05:37:35', '2024-10-13 05:37:35'),
(497, 3, 'MAX-PG', 'EP-140', NULL, NULL, '2024-10-13 05:47:57', '2024-10-13 05:47:57'),
(498, 3, 'AW-68', 'PG WHITE', NULL, NULL, '2024-10-14 05:08:43', '2024-10-14 05:08:43'),
(499, 3, 'EX-200', '3054', NULL, NULL, '2024-10-15 11:58:59', '2024-10-15 11:58:59'),
(500, 3, 'COOLER 48MM', NULL, NULL, NULL, '2024-10-15 12:21:36', '2024-10-15 12:21:36'),
(501, 3, 'S-130-5', 'RADIATOR BIG', NULL, NULL, '2024-10-16 11:55:25', '2024-10-16 11:55:25'),
(502, 3, 'S-130-5', 'RADIATOR SMALL', NULL, NULL, '2024-10-16 11:56:19', '2024-10-16 11:56:19'),
(503, 3, 'S-130-5', 'BLOW PIPE', NULL, NULL, '2024-10-16 11:57:01', '2024-10-16 11:57:01'),
(508, 11, 'HAV239', 'D200', NULL, NULL, '2024-10-17 12:58:10', '2024-10-17 12:58:10'),
(509, 11, 'HAV2399', NULL, NULL, NULL, '2024-10-17 12:58:53', '2024-10-17 12:58:53'),
(510, 11, 'HA1212', 'DE4433', NULL, NULL, '2024-10-18 05:25:16', '2024-10-18 05:25:16'),
(511, 11, 'HA1212', 'JA70', NULL, NULL, '2024-10-18 05:48:12', '2024-10-18 05:48:12'),
(513, 19, 'HA0099', 'DE1122', NULL, NULL, '2024-10-18 11:23:10', '2024-10-18 11:23:10'),
(514, 3, 'SB-50', NULL, NULL, NULL, '2024-10-19 11:25:06', '2024-10-19 11:25:06'),
(515, 3, 'S-130-5', NULL, NULL, NULL, '2024-10-19 11:45:54', '2024-10-19 11:45:54'),
(516, 3, 'EX-160', NULL, NULL, NULL, '2024-10-19 12:28:43', '2024-10-19 12:28:43'),
(517, 3, 'KIT', NULL, NULL, NULL, '2024-10-20 08:02:50', '2024-10-20 08:02:50'),
(518, 3, 'DX-225', '61 TEETH', NULL, NULL, '2024-10-20 13:54:22', '2024-10-20 13:54:22'),
(519, 3, 'S-130-5', '24 INCH', NULL, NULL, '2024-10-20 14:02:27', '2024-10-20 14:02:27'),
(520, 19, 'TE122', 'CH001', NULL, NULL, '2024-10-21 03:56:15', '2024-10-21 03:56:15'),
(521, 19, 'TE122', 'JA221', NULL, NULL, '2024-10-21 06:04:11', '2024-10-21 06:04:11'),
(522, 3, '37*104', NULL, NULL, NULL, '2024-10-21 13:12:51', '2024-10-21 13:12:51'),
(523, 3, 'EX-270', 'HOUSING', NULL, NULL, '2024-10-21 13:34:22', '2024-10-21 13:34:22'),
(524, 19, 'SU001', 'JA200', NULL, NULL, '2024-10-22 07:30:27', '2024-10-22 07:30:27'),
(525, 3, 'DX-225', '22-13 TEETH', NULL, NULL, '2024-10-22 11:56:14', '2024-10-22 11:56:14'),
(526, 3, 'S-130-5', '16MM', NULL, NULL, '2024-10-23 13:28:47', '2024-10-23 13:28:47'),
(527, 3, 'TITE', NULL, NULL, NULL, '2024-10-23 13:29:25', '2024-10-23 13:29:25'),
(528, 3, 'ZX-450', NULL, NULL, NULL, '2024-10-23 13:33:51', '2024-10-23 13:33:51'),
(529, 3, 'SB-50', NULL, NULL, NULL, '2024-10-24 09:40:27', '2024-10-24 09:40:27'),
(530, 19, 'H333', 'J444', NULL, NULL, '2024-10-25 10:29:51', '2024-10-25 10:29:51'),
(531, 19, 'H01', 'J10', NULL, NULL, '2024-10-25 10:42:48', '2024-10-25 10:42:48'),
(532, 19, 'H99', 'J88', NULL, NULL, '2024-10-25 10:47:59', '2024-10-25 10:47:59'),
(533, 19, 'H78', 'J56', NULL, NULL, '2024-10-25 10:50:54', '2024-10-25 10:50:54'),
(534, 19, 'H09', 'J80', NULL, NULL, '2024-10-25 10:52:58', '2024-10-25 10:52:58'),
(535, 19, 'J01', 'Y10', NULL, NULL, '2024-10-25 11:01:17', '2024-10-25 11:01:17'),
(536, 19, 'Y30', 'J03', NULL, NULL, '2024-10-25 11:03:24', '2024-10-25 11:03:24'),
(537, 19, 'Y03', 'J20', NULL, NULL, '2024-10-25 11:05:30', '2024-10-25 11:05:30'),
(538, 19, 'Y89', 'C12', NULL, NULL, '2024-10-25 11:10:27', '2024-10-25 11:10:27'),
(539, 19, 'P01', 'J10', NULL, NULL, '2024-10-25 11:18:40', '2024-10-25 11:18:40'),
(540, 19, 'P98', 'J55', NULL, NULL, '2024-10-25 11:38:32', '2024-10-25 11:38:32'),
(541, 19, 'P33', 'C22', NULL, NULL, '2024-10-25 11:42:04', '2024-10-25 11:42:04'),
(542, 19, 'R010', 'J021', NULL, NULL, '2024-10-25 11:55:09', '2024-10-25 11:55:09'),
(543, 19, 'R66', 'J55', NULL, NULL, '2024-10-25 12:06:12', '2024-10-25 12:06:12'),
(544, 3, 'R-1400', 'HLX-8949', NULL, NULL, '2024-10-27 11:17:46', '2024-10-27 11:17:46'),
(545, 3, 'M2X63', NULL, NULL, NULL, '2024-10-27 11:21:32', '2024-10-27 11:21:32'),
(546, 3, 'M2X63', NULL, NULL, NULL, '2024-10-27 11:23:22', '2024-10-27 11:23:22'),
(547, 3, 'A8V55', NULL, NULL, NULL, '2024-10-27 11:25:45', '2024-10-27 11:25:45'),
(548, 3, 'A8V86', NULL, NULL, NULL, '2024-10-27 11:26:21', '2024-10-27 11:26:21'),
(549, 14, '45645', NULL, NULL, NULL, '2024-12-17 09:18:50', '2024-12-17 09:18:50');

-- --------------------------------------------------------

--
-- Table structure for table `origins`
--

CREATE TABLE `origins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `origins`
--

INSERT INTO `origins` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 3, 'Korea', '2024-07-09 08:14:37', '2024-07-09 08:14:37'),
(2, 3, 'JAPAN', '2024-07-09 09:22:37', '2024-07-09 09:22:37'),
(3, 6, 'Japan', '2024-07-29 10:24:43', '2024-07-29 10:24:43'),
(4, 6, 'Germany', '2024-07-30 10:12:55', '2024-07-30 10:12:55'),
(5, 6, 'PAKISTAN', '2024-07-30 10:27:07', '2024-07-30 10:27:07'),
(6, 6, 'Bangaladesh', '2024-07-31 04:39:55', '2024-07-31 04:39:55'),
(7, 6, 'Newzeland', '2024-07-31 07:52:12', '2024-07-31 07:52:12'),
(8, 6, 'SIIRILANKA', '2024-08-01 04:53:39', '2024-08-01 04:53:39'),
(9, 6, 'Korea', '2024-08-05 08:31:16', '2024-08-05 08:31:16'),
(10, 8, 'origintest', '2024-08-22 10:43:47', '2024-08-22 10:43:47'),
(11, 10, 'Local', '2024-08-26 06:46:51', '2024-08-26 06:46:51'),
(12, 10, 'Japan', '2024-08-26 06:47:06', '2024-08-26 06:47:06'),
(13, 11, 'werw', '2024-08-28 08:21:19', '2024-08-28 08:21:19'),
(14, 13, 'gkkgf', '2024-08-30 10:54:48', '2024-08-30 10:54:48'),
(15, 11, 'Japan', '2024-10-17 05:48:19', '2024-10-17 05:48:19'),
(16, 11, 'PAKISTAN', '2024-10-17 08:36:55', '2024-10-17 08:36:55'),
(17, 11, 'JAPAN', '2024-10-18 05:46:02', '2024-10-18 05:46:02'),
(18, 19, 'JAPAN', '2024-10-18 08:08:08', '2024-10-18 08:08:08'),
(19, 19, 'PAKISTAN', '2024-10-18 08:08:17', '2024-10-18 08:08:17'),
(20, 19, 'CHINA', '2024-10-18 08:08:25', '2024-10-18 08:08:25'),
(21, 19, 'AMERICA', '2024-10-21 03:51:25', '2024-10-21 03:51:25'),
(22, 19, 'PAKISTAN', '2024-10-22 07:26:07', '2024-10-22 07:26:07'),
(23, 19, 'JAPAN', '2024-10-25 10:12:51', '2024-10-25 10:12:51'),
(24, 27, 'japan', '2024-10-28 12:05:49', '2024-10-28 12:05:49');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `features` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `discount` double DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `name`, `price`, `features`, `status`, `discount`, `created_at`, `updated_at`) VALUES
(1, 'Free Trial', 0.00, 'Dashboard stats, Parts Management, Inventory, Sale, Transfer, Supplier, Customer, Stores, Reports, Expense Type, Accounts, Vouchers, Financial Statements, Manage', 1, NULL, '2024-07-09 05:10:27', '2024-09-10 09:07:34'),
(2, 'Basic', 5000.00, 'Dashboard stats, Parts Management, Inventory, Sale, Transfer, Supplier, Customer, Stores, Reports, Expense Type, Accounts, Vouchers, Financial Statements, Manage', 1, 10, '2024-07-09 05:10:27', '2024-09-25 05:36:34'),
(3, 'Silver', 8000.00, 'Dashboard stats, Parts Management, Inventory, Sale, Transfer, Supplier, Customer, Stores, Reports, Expense Type, Accounts, Vouchers, Financial Statements, Manage', 1, 10, '2024-07-09 05:10:27', '2024-09-25 05:36:59'),
(4, 'Gold', 10000.00, 'Dashboard stats, Parts Management, Inventory, Sale, Transfer, Supplier, Customer, Stores, Reports, Expense Type, Accounts, Vouchers, Financial Statements, Manage', 1, 10, '2024-07-09 05:10:27', '2024-09-25 05:37:24');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `people`
--

CREATE TABLE `people` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `cnic` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `opening_balance` double DEFAULT NULL,
  `date` date NOT NULL DEFAULT '2024-08-06',
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `people`
--

INSERT INTO `people` (`id`, `user_id`, `name`, `father_name`, `phone_no`, `email`, `cnic`, `address`, `opening_balance`, `date`, `isActive`, `created_at`, `updated_at`) VALUES
(1, 3, 'GEO IMPEX (S)', NULL, NULL, NULL, NULL, 'SARAY KHARBOZA STOP', 0, '2024-06-01', 1, '2024-09-01 12:24:30', '2024-09-01 12:24:30'),
(2, 3, 'HAMDAN AUTO (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-06-01', 1, '2024-09-01 12:25:36', '2024-09-01 12:25:36'),
(3, 3, 'LUQMAN AFRIDI (S)', NULL, NULL, NULL, NULL, 'ALLAH NOOR PLAZA', 0, '2024-06-01', 1, '2024-09-01 12:26:06', '2024-09-01 12:26:06'),
(4, 3, 'AWAIS (S)', NULL, NULL, NULL, NULL, 'NEAR WALEED PLAZA', 0, '2024-06-01', 1, '2024-09-02 08:41:41', '2024-09-02 08:41:41'),
(5, 3, 'KASHIF (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-06-01', 1, '2024-09-02 08:50:48', '2024-09-02 08:50:48'),
(6, 3, 'LUCKY TRADERS (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-06-01', 1, '2024-09-02 08:51:20', '2024-09-02 08:51:20'),
(7, 3, 'ZAHORE ELECTRITION (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-06-01', 1, '2024-09-02 09:29:48', '2024-09-02 09:29:48'),
(8, 3, 'YOUNAS AYUB&CO (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-06-01', 1, '2024-09-02 10:13:51', '2024-09-02 10:13:51'),
(9, 3, 'MAMA AKRAM LAHORE (S)', NULL, NULL, NULL, NULL, 'LAHORE', -1, '2024-06-01', 1, '2024-09-02 11:22:24', '2024-09-02 11:22:24'),
(10, 3, 'SWATTI AUTOS (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-06-11', 1, '2024-09-02 11:40:55', '2024-09-02 11:40:55'),
(11, 3, 'ALI (S)', 'AR-REHMAN AUTO', NULL, NULL, NULL, 'MEHRAN PLAZA', 0, '2024-06-01', 1, '2024-09-02 12:09:15', '2024-09-02 12:09:15'),
(12, 3, 'ADNAN BERING (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', -1, '2024-06-01', 1, '2024-09-02 12:40:30', '2024-09-02 12:40:30'),
(13, 3, 'AMC TRADING COMPANY (S)', NULL, NULL, NULL, NULL, 'LAHORE', 0, '2024-06-01', 1, '2024-09-03 09:05:33', '2024-09-03 09:05:33'),
(14, 3, 'IRFAN BROTHER (S)', NULL, NULL, NULL, NULL, 'QATAR PLAZA', 0, '2024-06-01', 1, '2024-09-03 10:03:07', '2024-09-03 10:03:07'),
(15, 3, 'ASIF DOOSAN AUTO (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-06-01', 1, '2024-09-03 11:58:45', '2024-09-03 11:58:45'),
(16, 3, 'TEHSEEN AYUB&CO (S)', NULL, NULL, NULL, NULL, NULL, 0, '2024-07-01', 1, '2024-09-04 06:27:21', '2024-09-04 06:27:21'),
(17, 3, 'SADAM (S)', 'AL NOOR', NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-07-01', 1, '2024-09-04 06:31:59', '2024-09-04 06:31:59'),
(18, 3, 'INSAAF AUTO (S)', NULL, NULL, NULL, NULL, NULL, 0, '2024-07-01', 1, '2024-09-04 07:05:56', '2024-09-04 07:05:56'),
(19, 3, 'QISMAT WAZEER (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-07-01', 1, '2024-09-04 08:12:50', '2024-09-04 08:12:50'),
(20, 3, 'REHMAT BUSH & BOLTS', NULL, NULL, NULL, NULL, 'MADNI MARKEET', 0, '2024-07-01', 1, '2024-09-04 12:03:55', '2024-09-04 12:03:55'),
(22, 3, 'PEHELWAN TRADER (S)', NULL, NULL, NULL, NULL, 'DUBAI PLAZA', 0, '2024-07-01', 1, '2024-09-04 12:13:06', '2024-09-04 12:13:06'),
(23, 3, 'CHOUDRY INTERPRISES (S)', NULL, NULL, NULL, NULL, 'QATAR PLAZA', 0, '2024-07-01', 1, '2024-09-04 12:33:48', '2024-09-04 12:33:48'),
(25, 3, 'MH TRADER (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-07-01', 1, '2024-09-04 12:56:10', '2024-09-04 12:56:10'),
(26, 3, 'RAHEEM INTERPRISES GJW (C)', NULL, NULL, NULL, NULL, 'GUJRANWALA', 0, '2024-06-01', 1, '2024-09-04 13:22:28', '2024-09-04 13:22:28'),
(27, 3, 'HAMDAN AUTO (C)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-06-01', 1, '2024-09-04 13:28:19', '2024-09-04 13:28:19'),
(28, 3, 'LUCKY TRADERS (C)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-07-01', 1, '2024-09-04 13:34:48', '2024-09-04 13:34:48'),
(29, 3, 'SHAMS AUTO (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-07-01', 1, '2024-09-05 04:47:35', '2024-09-05 04:47:35'),
(30, 3, 'BABA ALHAIDER (S)', NULL, NULL, NULL, NULL, NULL, 0, '2024-07-01', 1, '2024-09-05 04:52:33', '2024-09-05 04:52:33'),
(31, 3, 'INAAM KHAN (S)', NULL, NULL, NULL, NULL, 'QATAR PLAZA', 0, '2024-07-01', 1, '2024-09-05 04:55:18', '2024-09-05 04:55:18'),
(32, 3, 'QADIR BHAI (S)', 'ABDUL.MANNAN AUTO', NULL, NULL, NULL, 'QATAR PLAZA', 0, '2024-07-01', 1, '2024-09-05 07:50:25', '2024-09-05 07:50:25'),
(33, 3, 'NOOR KHAN (S)', NULL, NULL, NULL, NULL, 'ADEEL MARKEET', 0, '2024-07-01', 1, '2024-09-05 08:22:24', '2024-09-05 08:22:24'),
(34, 3, 'ALI RIZWAN FILTER (S)', NULL, NULL, NULL, NULL, NULL, 0, '2024-07-01', 1, '2024-09-05 08:29:35', '2024-09-05 08:29:35'),
(35, 3, 'USAMA BELT STORE (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-07-01', 1, '2024-09-05 08:32:13', '2024-09-05 08:32:13'),
(36, 3, 'BAKHT MEER ZADA (S)', 'OLD PARTS', NULL, NULL, NULL, NULL, 0, '2024-07-01', 1, '2024-09-05 08:59:43', '2024-09-05 08:59:43'),
(37, 3, 'ALI (C)', NULL, NULL, NULL, NULL, 'MEHRAN PLAZA', NULL, '2024-07-01', 1, '2024-09-07 04:49:21', '2024-09-07 04:49:21'),
(38, 3, 'QARI SIFAT (S)', 'JAJI SPIN GHAR', NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-07-01', 1, '2024-09-07 05:52:04', '2024-09-07 05:52:04'),
(39, 3, 'HAROON BHAI (S)', 'QAAZ IMPEX', NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-08-01', 1, '2024-09-07 08:13:51', '2024-09-07 08:13:51'),
(40, 3, 'SHAIR QAYOOM (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-08-01', 1, '2024-09-07 09:01:22', '2024-09-07 09:01:22'),
(41, 3, 'ABDULLAH AUTOZ (S)', 'A.B AUTOZ', NULL, NULL, NULL, 'ZIYARAT PLAZA', 0, '2024-08-01', 1, '2024-09-07 09:42:05', '2024-09-07 09:42:05'),
(42, 3, 'MARDAN AUTO (S)', NULL, NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-08-01', 1, '2024-09-07 10:00:56', '2024-09-07 10:00:56'),
(43, 3, 'QAZ IMPEX (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-08-01', 1, '2024-09-07 12:42:32', '2024-09-07 12:42:32'),
(44, 3, 'SWATTI AUTOS (C)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', NULL, '2024-07-01', 1, '2024-09-07 13:19:13', '2024-09-07 13:19:13'),
(45, 3, 'FARHAN WATER BODY (S)', NULL, NULL, NULL, NULL, 'ADEEL MARKEET', 0, '2024-08-01', 1, '2024-09-08 05:46:34', '2024-09-08 05:46:34'),
(46, 3, 'ASLAM LAHORE (S)', NULL, NULL, NULL, NULL, 'LAHORE', 0, '2024-08-01', 1, '2024-09-09 12:24:13', '2024-09-09 12:24:13'),
(47, 3, 'AWAIS OLD PARTS (S)', NULL, NULL, NULL, NULL, 'ALLAH NOOR PLAZA', 0, '2024-08-21', 1, '2024-09-09 13:25:44', '2024-09-09 13:25:44'),
(48, 3, 'FAZAL MUQEEM (S)', NULL, NULL, NULL, NULL, 'ALLAH NOOR PLAZA', 0, '2024-08-01', 1, '2024-09-10 06:05:41', '2024-09-10 06:05:41'),
(49, 3, 'KHURAM WAH (S)', NULL, NULL, NULL, NULL, 'BATR MORH', 0, '2024-08-01', 1, '2024-09-10 06:15:15', '2024-09-10 06:15:15'),
(50, 3, 'SHEHZAD DOOSAN (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-01', 1, '2024-09-10 06:46:51', '2024-09-10 06:46:51'),
(51, 3, 'NAZEER OSTAD (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-01', 1, '2024-09-10 07:24:48', '2024-09-10 07:24:48'),
(52, 3, 'MASOOD OSTAD (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-01', 1, '2024-09-10 11:18:34', '2024-09-10 11:18:34'),
(53, 3, 'AWAIS OLD PARTS (C)', NULL, NULL, NULL, NULL, 'ALLAH NOOR PLAZA', NULL, '2024-07-01', 1, '2024-09-10 12:50:02', '2024-09-10 12:50:02'),
(54, 3, 'REHMAT OSTAD (C)', NULL, NULL, NULL, NULL, NULL, 0, '2024-08-01', 1, '2024-09-10 13:04:07', '2024-09-10 13:04:07'),
(55, 3, 'HAJI SB EW-170 (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-01', 1, '2024-09-10 13:04:29', '2024-09-10 13:04:29'),
(56, 3, 'BAKHT MEER ZADA (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-01', 1, '2024-09-10 13:20:32', '2024-09-10 13:20:32'),
(57, 3, 'HAROON BHAI (C)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', NULL, '2024-08-01', 1, '2024-09-11 05:12:53', '2024-09-11 05:12:53'),
(58, 3, 'KASHIF KHAN (C)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', NULL, '2024-06-01', 1, '2024-09-11 07:24:15', '2024-09-11 07:24:15'),
(59, 3, 'TANWEER OSTAD (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-01', 1, '2024-09-11 09:29:46', '2024-09-11 09:29:46'),
(60, 3, 'SAEED TRADERS (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-09-01', 1, '2024-09-11 11:39:05', '2024-09-11 11:39:05'),
(61, 3, 'KASHIF OSTAD (C)', NULL, NULL, NULL, NULL, 'SAIM PLAZA', NULL, '2024-09-01', 1, '2024-09-19 09:08:31', '2024-09-19 09:08:31'),
(62, 3, 'ABID OSTAD (C)', NULL, NULL, NULL, NULL, 'KHUDAD MARKEET', NULL, '2024-09-01', 1, '2024-09-19 11:10:57', '2024-09-19 11:10:57'),
(63, 3, 'RAHEEM INTERPRISES GJW (S)', 'RKS', NULL, NULL, NULL, 'GUJRANWALA', 0, '2024-09-01', 1, '2024-09-22 04:34:11', '2024-09-22 04:34:11'),
(64, 3, 'HAKAB (C)', NULL, '03004560711', NULL, NULL, NULL, 0, '2024-09-01', 1, '2024-09-22 04:51:17', '2024-09-22 04:51:17'),
(65, 3, 'IBRAHIM AUTO (C)', NULL, '03464087686', NULL, NULL, NULL, 0, '2024-09-01', 1, '2024-09-22 05:12:36', '2024-09-22 05:12:36'),
(66, 3, 'ADNAN OSTAD (C)', NULL, NULL, NULL, NULL, 'ADEEL MARKEET', NULL, '2024-09-01', 1, '2024-09-24 11:59:09', '2024-09-24 11:59:09'),
(68, 3, 'HIDAYAT (S)', 'GHARWAL AUTO', NULL, NULL, NULL, 'ITEHAD PLAZA', 0, '2024-09-01', 1, '2024-09-24 12:16:38', '2024-09-24 12:16:38'),
(69, 3, 'IRFAN PATHAN (C)', NULL, NULL, NULL, NULL, NULL, NULL, '0000-00-00', 1, '2024-09-30 13:01:36', '2024-09-30 13:01:36'),
(70, 3, 'PETRONAL GULF LUBRICANTS (S)', NULL, '03115149540', NULL, NULL, 'AMAN PLAZA', 0, '2024-10-01', 1, '2024-10-14 05:11:13', '2024-10-14 05:11:13'),
(71, 3, 'EX-270 REHMAT OSTAD (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-01', 1, '2024-10-15 11:17:58', '2024-10-15 11:17:58'),
(72, 3, 'HAFIZ IRFAN SAAB (C)', NULL, '03005537577', NULL, NULL, 'PINDI GHEB', NULL, '2024-10-01', 1, '2024-10-15 12:12:36', '2024-10-15 12:12:36'),
(73, 11, 'Abbas', NULL, '03333333333', NULL, NULL, NULL, NULL, '0000-00-00', 1, '2024-10-17 05:53:17', '2024-10-17 05:53:17'),
(74, 11, 'ILYAS', 'ILYAS ATOS', NULL, NULL, NULL, 'RAWALPINDI', NULL, '0000-00-00', 1, '2024-10-17 10:01:27', '2024-10-17 10:01:27'),
(75, 11, 'ALI', 'ALI AUTOS', '03302121212', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 05:51:39', '2024-10-18 05:51:39'),
(76, 11, 'ammar', 'ammar Autos', '03302121212', NULL, NULL, NULL, NULL, '2024-10-17', 1, '2024-10-18 06:13:28', '2024-10-18 06:13:28'),
(77, 11, 'khalid', NULL, '03003333333', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 06:25:33', '2024-10-18 06:25:33'),
(78, 19, 'ALI', 'ALI AUTOS', '03003333333', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 09:33:45', '2024-10-18 09:33:45'),
(79, 19, 'KHALID', 'KHALID AUTOS', '03332222222', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 09:34:25', '2024-10-18 09:34:25'),
(80, 19, 'AMMAR', NULL, '03002222222', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 09:58:02', '2024-10-18 09:58:02'),
(81, 19, 'KAMAL', 'KAMAL AUTOS', '03004444444', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 11:01:03', '2024-10-18 11:01:03'),
(82, 19, 'Waqas', NULL, '03004444444', NULL, NULL, NULL, NULL, '2024-10-18', 1, '2024-10-18 11:45:55', '2024-10-18 11:45:55'),
(83, 3, 'KOMATSO REHMAT WORK SHOP (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-01', 1, '2024-10-20 08:00:21', '2024-10-20 08:00:21'),
(85, 3, 'SADIQ AUTO (S)', NULL, NULL, NULL, NULL, 'AMAN PLAZA', 0, '2024-10-01', 1, '2024-10-20 13:55:22', '2024-10-20 13:55:22'),
(86, 3, 'DX-140 REHMAT OSTAD (C)', NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-01', 1, '2024-10-20 14:09:58', '2024-10-20 14:09:58'),
(87, 19, 'ABDULLAH', NULL, '03014433333', NULL, NULL, NULL, NULL, '2024-10-21', 1, '2024-10-21 04:11:10', '2024-10-21 04:11:10'),
(88, 19, 'HANZLA', NULL, '03005555555', NULL, NULL, NULL, NULL, '2024-10-21', 1, '2024-10-21 05:23:46', '2024-10-21 05:24:08'),
(89, 19, 'Zain', NULL, '03110000000', NULL, NULL, NULL, NULL, '2024-10-25', 1, '2024-10-25 06:32:17', '2024-10-25 06:32:47'),
(90, 19, 'Khuram', 'Bike Parts', NULL, NULL, NULL, NULL, NULL, '2024-10-25', 1, '2024-10-25 10:31:38', '2024-10-25 10:31:38'),
(91, 14, 'dsf', '34', '03444444444', NULL, NULL, '3434', NULL, '0000-00-00', 1, '2024-12-17 09:19:36', '2024-12-17 09:19:36');

-- --------------------------------------------------------

--
-- Table structure for table `people_person_types`
--

CREATE TABLE `people_person_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `person_id` bigint(20) UNSIGNED NOT NULL,
  `person_type_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `people_person_types`
--

INSERT INTO `people_person_types` (`id`, `user_id`, `person_id`, `person_type_id`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 2, '2024-09-01 12:24:30', '2024-09-01 12:24:30'),
(2, 3, 2, 2, '2024-09-01 12:25:36', '2024-09-01 12:25:36'),
(3, 3, 3, 2, '2024-09-01 12:26:06', '2024-09-01 12:26:06'),
(4, 3, 4, 2, '2024-09-02 08:41:41', '2024-09-02 08:41:41'),
(5, 3, 5, 2, '2024-09-02 08:50:48', '2024-09-02 08:50:48'),
(6, 3, 6, 2, '2024-09-02 08:51:20', '2024-09-02 08:51:20'),
(7, 3, 7, 2, '2024-09-02 09:29:48', '2024-09-02 09:29:48'),
(8, 3, 8, 2, '2024-09-02 10:13:51', '2024-09-02 10:13:51'),
(9, 3, 9, 2, '2024-09-02 11:22:24', '2024-09-02 11:22:24'),
(10, 3, 10, 2, '2024-09-02 11:40:55', '2024-09-02 11:40:55'),
(11, 3, 11, 2, '2024-09-02 12:09:15', '2024-09-02 12:09:15'),
(12, 3, 12, 2, '2024-09-02 12:40:30', '2024-09-02 12:40:30'),
(13, 3, 13, 2, '2024-09-03 09:05:33', '2024-09-03 09:05:33'),
(14, 3, 14, 2, '2024-09-03 10:03:07', '2024-09-03 10:03:07'),
(15, 3, 15, 2, '2024-09-03 11:58:45', '2024-09-03 11:58:45'),
(16, 3, 16, 2, '2024-09-04 06:27:21', '2024-09-04 06:27:21'),
(17, 3, 17, 2, '2024-09-04 06:31:59', '2024-09-04 06:31:59'),
(18, 3, 18, 2, '2024-09-04 07:05:56', '2024-09-04 07:05:56'),
(19, 3, 19, 2, '2024-09-04 08:12:50', '2024-09-04 08:12:50'),
(20, 3, 20, 2, '2024-09-04 12:03:55', '2024-09-04 12:03:55'),
(22, 3, 22, 2, '2024-09-04 12:13:06', '2024-09-04 12:13:06'),
(23, 3, 23, 2, '2024-09-04 12:33:48', '2024-09-04 12:33:48'),
(25, 3, 25, 2, '2024-09-04 12:56:10', '2024-09-04 12:56:10'),
(26, 3, 26, 1, '2024-09-04 13:22:28', '2024-09-04 13:22:28'),
(27, 3, 27, 1, '2024-09-04 13:28:19', '2024-09-04 13:28:19'),
(28, 3, 28, 1, '2024-09-04 13:34:48', '2024-09-04 13:34:48'),
(29, 3, 29, 2, '2024-09-05 04:47:35', '2024-09-05 04:47:35'),
(30, 3, 30, 2, '2024-09-05 04:52:33', '2024-09-05 04:52:33'),
(31, 3, 31, 2, '2024-09-05 04:55:18', '2024-09-05 04:55:18'),
(32, 3, 32, 2, '2024-09-05 07:50:25', '2024-09-05 07:50:25'),
(33, 3, 33, 2, '2024-09-05 08:22:24', '2024-09-05 08:22:24'),
(34, 3, 34, 2, '2024-09-05 08:29:35', '2024-09-05 08:29:35'),
(35, 3, 35, 2, '2024-09-05 08:32:13', '2024-09-05 08:32:13'),
(36, 3, 36, 2, '2024-09-05 08:59:43', '2024-09-05 08:59:43'),
(37, 3, 37, 1, '2024-09-07 04:49:21', '2024-09-07 04:49:21'),
(38, 3, 38, 2, '2024-09-07 05:52:04', '2024-09-07 05:52:04'),
(39, 3, 39, 2, '2024-09-07 08:13:51', '2024-09-07 08:13:51'),
(40, 3, 40, 2, '2024-09-07 09:01:22', '2024-09-07 09:01:22'),
(41, 3, 41, 2, '2024-09-07 09:42:05', '2024-09-07 09:42:05'),
(42, 3, 42, 2, '2024-09-07 10:00:56', '2024-09-07 10:00:56'),
(43, 3, 43, 2, '2024-09-07 12:42:32', '2024-09-07 12:42:32'),
(44, 3, 44, 1, '2024-09-07 13:19:13', '2024-09-07 13:19:13'),
(45, 3, 45, 2, '2024-09-08 05:46:34', '2024-09-08 05:46:34'),
(46, 3, 46, 2, '2024-09-09 12:24:13', '2024-09-09 12:24:13'),
(47, 3, 47, 2, '2024-09-09 13:25:44', '2024-09-09 13:25:44'),
(48, 3, 48, 2, '2024-09-10 06:05:41', '2024-09-10 06:05:41'),
(49, 3, 49, 2, '2024-09-10 06:15:15', '2024-09-10 06:15:15'),
(50, 3, 50, 1, '2024-09-10 06:46:51', '2024-09-10 06:46:51'),
(51, 3, 51, 1, '2024-09-10 07:24:48', '2024-09-10 07:24:48'),
(52, 3, 52, 1, '2024-09-10 11:18:34', '2024-09-10 11:18:34'),
(53, 3, 53, 1, '2024-09-10 12:50:02', '2024-09-10 12:50:02'),
(54, 3, 54, 1, '2024-09-10 13:04:07', '2024-09-10 13:04:07'),
(55, 3, 55, 1, '2024-09-10 13:04:29', '2024-09-10 13:04:29'),
(56, 3, 56, 1, '2024-09-10 13:20:32', '2024-09-10 13:20:32'),
(57, 3, 57, 1, '2024-09-11 05:12:53', '2024-09-11 05:12:53'),
(58, 3, 58, 1, '2024-09-11 07:24:15', '2024-09-11 07:24:15'),
(59, 3, 59, 1, '2024-09-11 09:29:46', '2024-09-11 09:29:46'),
(60, 3, 60, 2, '2024-09-11 11:39:05', '2024-09-11 11:39:05'),
(61, 3, 61, 1, '2024-09-19 09:08:31', '2024-09-19 09:08:31'),
(62, 3, 62, 1, '2024-09-19 11:10:57', '2024-09-19 11:10:57'),
(63, 3, 63, 2, '2024-09-22 04:34:11', '2024-09-22 04:34:11'),
(64, 3, 64, 1, '2024-09-22 04:51:17', '2024-09-22 04:51:17'),
(65, 3, 65, 1, '2024-09-22 05:12:36', '2024-09-22 05:12:36'),
(66, 3, 66, 1, '2024-09-24 11:59:09', '2024-09-24 11:59:09'),
(68, 3, 68, 2, '2024-09-24 12:16:38', '2024-09-24 12:16:38'),
(69, 3, 69, 1, '2024-09-30 13:01:36', '2024-09-30 13:01:36'),
(70, 3, 70, 2, '2024-10-14 05:11:13', '2024-10-14 05:11:13'),
(71, 3, 71, 1, '2024-10-15 11:17:58', '2024-10-15 11:17:58'),
(72, 3, 72, 1, '2024-10-15 12:12:36', '2024-10-15 12:12:36'),
(73, 11, 73, 2, '2024-10-17 05:53:17', '2024-10-17 05:53:17'),
(74, 11, 74, 2, '2024-10-17 10:01:27', '2024-10-17 10:01:27'),
(75, 11, 75, 2, '2024-10-18 05:51:39', '2024-10-18 05:51:39'),
(76, 11, 76, 1, '2024-10-18 06:13:28', '2024-10-18 06:13:28'),
(77, 11, 77, 1, '2024-10-18 06:25:33', '2024-10-18 06:25:33'),
(78, 19, 78, 2, '2024-10-18 09:33:45', '2024-10-18 09:33:45'),
(79, 19, 79, 2, '2024-10-18 09:34:25', '2024-10-18 09:34:25'),
(80, 19, 80, 1, '2024-10-18 09:58:02', '2024-10-18 09:58:02'),
(81, 19, 81, 2, '2024-10-18 11:01:03', '2024-10-18 11:01:03'),
(82, 19, 82, 1, '2024-10-18 11:45:55', '2024-10-18 11:45:55'),
(83, 3, 83, 1, '2024-10-20 08:00:21', '2024-10-20 08:00:21'),
(85, 3, 85, 2, '2024-10-20 13:55:22', '2024-10-20 13:55:22'),
(86, 3, 86, 1, '2024-10-20 14:09:58', '2024-10-20 14:09:58'),
(87, 19, 87, 1, '2024-10-21 04:11:10', '2024-10-21 04:11:10'),
(88, 19, 88, 1, '2024-10-21 05:23:46', '2024-10-21 05:23:46'),
(89, 19, 89, 1, '2024-10-25 06:32:17', '2024-10-25 06:32:17'),
(90, 19, 90, 2, '2024-10-25 10:31:38', '2024-10-25 10:31:38'),
(91, 14, 91, 2, '2024-12-17 09:19:36', '2024-12-17 09:19:36');

-- --------------------------------------------------------

--
-- Table structure for table `person_types`
--

CREATE TABLE `person_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `person_id` bigint(20) DEFAULT NULL,
  `po_no` varchar(255) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `remarks` varchar(155) DEFAULT NULL,
  `is_received` tinyint(4) NOT NULL DEFAULT 0,
  `is_approve` int(11) NOT NULL DEFAULT 0,
  `is_cancel` int(11) NOT NULL DEFAULT 0,
  `is_pending` int(11) NOT NULL DEFAULT 1,
  `request_date` date NOT NULL,
  `total` double NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `tax` double NOT NULL DEFAULT 0,
  `total_after_tax` double NOT NULL DEFAULT 0,
  `tax_in_figure` double NOT NULL DEFAULT 0,
  `total_after_discount` double NOT NULL DEFAULT 0,
  `dollar_rate` double NOT NULL DEFAULT 0,
  `created_by` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_completed` int(11) NOT NULL DEFAULT 0,
  `received_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_orders`
--

INSERT INTO `purchase_orders` (`id`, `user_id`, `person_id`, `po_no`, `store_id`, `remarks`, `is_received`, `is_approve`, `is_cancel`, `is_pending`, `request_date`, `total`, `discount`, `tax`, `total_after_tax`, `tax_in_figure`, `total_after_discount`, `dollar_rate`, `created_by`, `created_at`, `updated_at`, `is_completed`, `received_date`) VALUES
(1, 14, 91, '1', 12, NULL, 1, 0, 0, 0, '2024-12-17', 27500, 0, 0, 27500, 0, 27500, 275, 0, '2024-12-17 09:19:46', '2024-12-17 09:35:50', 1, '2024-12-17'),
(2, 14, 91, '2', 12, NULL, 1, 0, 0, 0, '2024-12-17', 41250, 0, 0, 41250, 0, 41250, 275, 0, '2024-12-17 09:20:10', '2024-12-17 09:41:31', 1, '2024-12-17');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_children`
--

CREATE TABLE `purchase_order_children` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` double(30,2) NOT NULL,
  `received_quantity` double NOT NULL DEFAULT 0,
  `purchase_price` double NOT NULL DEFAULT 0,
  `dollar_price` double NOT NULL DEFAULT 0,
  `amount` double NOT NULL DEFAULT 0,
  `expense` double NOT NULL DEFAULT 0,
  `unit_expense` double NOT NULL DEFAULT 0,
  `remarks` varchar(155) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase_order_children`
--

INSERT INTO `purchase_order_children` (`id`, `user_id`, `purchase_order_id`, `item_id`, `quantity`, `received_quantity`, `purchase_price`, `dollar_price`, `amount`, `expense`, `unit_expense`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 534, 10.00, 10, 2750, 0, 27500, 100, 10, '1', '2024-12-17 09:19:46', '2024-12-17 09:35:34'),
(2, 14, 2, 534, 5.00, 5, 2750, 0, 13750, 3.3333333333333, 0.66666666666667, '5', '2024-12-17 09:20:10', '2024-12-17 09:37:45'),
(3, 14, 2, 534, 10.00, 10, 2750, 0, 27500, 6.6666666666667, 0.66666666666667, '5', '2024-12-17 09:20:10', '2024-12-17 09:37:45');

-- --------------------------------------------------------

--
-- Table structure for table `racks`
--

CREATE TABLE `racks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  `store_id` int(11) NOT NULL,
  `rack_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `returned_purchase_orders`
--

CREATE TABLE `returned_purchase_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `remarks` varchar(155) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `discount` double NOT NULL DEFAULT 0,
  `deduction` double NOT NULL DEFAULT 0,
  `tax` double DEFAULT NULL,
  `total_after_tax` double DEFAULT NULL,
  `tax_in_figure` double DEFAULT NULL,
  `total_after_discount` double DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `returned_purchase_order_children`
--

CREATE TABLE `returned_purchase_order_children` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `returned_purchase_order_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `returned_quantity` double NOT NULL DEFAULT 0,
  `purchase_price` double DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `expense` double NOT NULL DEFAULT 0,
  `unit_expense` double NOT NULL DEFAULT 0,
  `remarks` varchar(155) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `returned_sales`
--

CREATE TABLE `returned_sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `inv_id` bigint(20) UNSIGNED NOT NULL,
  `return_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `received_amount` double DEFAULT NULL,
  `bank_received_amount` double DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `bank_account_id` int(11) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `deduction` double DEFAULT NULL,
  `gst` double DEFAULT NULL,
  `gst_percentage` double DEFAULT NULL,
  `total_after_gst` double DEFAULT NULL,
  `total_after_discount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `returned_sales`
--

INSERT INTO `returned_sales` (`id`, `user_id`, `inv_id`, `return_date`, `created_at`, `updated_at`, `store_id`, `remarks`, `total_amount`, `received_amount`, `bank_received_amount`, `account_id`, `bank_account_id`, `discount`, `deduction`, `gst`, `gst_percentage`, `total_after_gst`, `total_after_discount`) VALUES
(1, 14, 1, '2024-12-17', '2024-12-17 12:04:18', '2024-12-17 12:04:18', 12, NULL, 40, 40, 0, 371, NULL, NULL, 0, 0, 0, 40, 40),
(2, 14, 2, '2024-12-17', '2024-12-17 12:48:54', '2024-12-17 12:48:54', 12, NULL, 1653, 1653, 0, 371, NULL, NULL, 0, 0, 0, 1653, 1653),
(3, 14, 1, '2024-12-17', '2024-12-17 12:49:51', '2024-12-17 12:49:51', 12, NULL, 150, 150, 0, 371, NULL, NULL, 0, 0, 0, 150, 150),
(4, 14, 2, '2024-12-17', '2024-12-17 12:51:16', '2024-12-17 12:51:16', 12, NULL, 1102, 1102, 0, 371, NULL, NULL, 0, 0, 0, 1102, 1102);

-- --------------------------------------------------------

--
-- Table structure for table `returned_sale_children`
--

CREATE TABLE `returned_sale_children` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `returned_sales_id` int(10) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` double NOT NULL DEFAULT 0,
  `returned_quantity` double NOT NULL DEFAULT 0,
  `price` double NOT NULL DEFAULT 0,
  `cost` double NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `returned_sale_children`
--

INSERT INTO `returned_sale_children` (`id`, `user_id`, `returned_sales_id`, `item_id`, `quantity`, `returned_quantity`, `price`, `cost`, `created_at`, `updated_at`) VALUES
(1, 14, 1, 534, 4, 0, 10, 1799.875, '2024-12-17 12:04:18', '2024-12-17 12:04:18'),
(2, 14, 2, 534, 3, 0, 10, 791.42329545455, '2024-12-17 12:48:54', '2024-12-17 12:48:54'),
(3, 14, 3, 534, 15, 0, 10, 791.42329545455, '2024-12-17 12:49:51', '2024-12-17 12:49:51'),
(4, 14, 4, 534, 2, 0, 551, 1799.875, '2024-12-17 12:51:16', '2024-12-17 12:51:16');

-- --------------------------------------------------------

--
-- Table structure for table `return_rack_shelves`
--

CREATE TABLE `return_rack_shelves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `item_id` int(10) UNSIGNED DEFAULT NULL,
  `rack_id` int(10) UNSIGNED DEFAULT NULL,
  `shelf_id` int(10) UNSIGNED DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `return_purchase_order_id` int(10) UNSIGNED DEFAULT NULL,
  `return_purchase_order_child_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `return_sale_rack_shelves`
--

CREATE TABLE `return_sale_rack_shelves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `item_id` int(10) UNSIGNED DEFAULT NULL,
  `rack_id` int(10) UNSIGNED DEFAULT NULL,
  `shelf_id` int(10) UNSIGNED DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `return_inv_id` int(10) UNSIGNED DEFAULT NULL,
  `returned_sales_id` int(10) UNSIGNED DEFAULT NULL,
  `checked` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', NULL, NULL),
(2, 'Admin', NULL, NULL),
(3, 'Sales', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sale_histories`
--

CREATE TABLE `sale_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_child_id` int(11) NOT NULL,
  `purchaseorder_child_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `unit_expense` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `negative_quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale_rack_shelves`
--

CREATE TABLE `sale_rack_shelves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `item_id` int(10) UNSIGNED DEFAULT NULL,
  `rack_id` int(10) UNSIGNED DEFAULT NULL,
  `shelf_id` int(10) UNSIGNED DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `invoice_id` int(10) UNSIGNED DEFAULT NULL,
  `invoice_child_id` int(10) UNSIGNED DEFAULT NULL,
  `checked` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shelves`
--

CREATE TABLE `shelves` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  `store_id` int(10) UNSIGNED NOT NULL,
  `shelf_number` varchar(255) DEFAULT NULL,
  `rack_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shelves`
--

INSERT INTO `shelves` (`id`, `user_id`, `code`, `store_id`, `shelf_number`, `rack_id`, `created_at`, `updated_at`) VALUES
(1, 11, 101, 9, 'S 1', 1, '2024-10-17 05:57:30', '2024-10-17 05:57:30'),
(2, 11, 102, 9, 'S 2', 1, '2024-10-17 05:57:58', '2024-10-17 05:57:58'),
(3, 11, 201, 9, 'S1', 2, '2024-10-17 10:16:57', '2024-10-17 10:16:57'),
(4, 11, 202, 9, 'S1', 2, '2024-10-17 10:32:41', '2024-10-17 10:32:41'),
(5, 11, 401, 9, 'S2', 4, '2024-10-17 10:33:35', '2024-10-17 10:33:35'),
(6, 11, 203, 9, 'S1', 2, '2024-10-17 10:37:48', '2024-10-17 10:37:48'),
(7, 11, 204, 9, 'S1', 2, '2024-10-18 05:57:34', '2024-10-18 05:57:34'),
(8, 19, 801, 16, 'S1', 8, '2024-10-18 09:36:54', '2024-10-18 09:36:54'),
(9, 19, 901, 16, 'S2', 9, '2024-10-18 09:37:11', '2024-10-18 09:37:11'),
(10, 19, 1001, 16, 'S1', 10, '2024-10-18 10:46:59', '2024-10-18 10:46:59'),
(11, 19, 1301, 16, 'B1', 13, '2024-10-18 11:25:03', '2024-10-18 11:25:03'),
(12, 19, 1302, 16, 'B1', 13, '2024-10-21 03:59:05', '2024-10-21 03:59:05'),
(13, 19, 1401, 16, 'B1', 14, '2024-10-21 06:06:05', '2024-10-21 06:06:05'),
(14, 19, 1601, 16, '2', 16, '2024-10-22 06:46:38', '2024-10-22 06:46:38'),
(15, 19, 1901, 16, 'Shelf 1', 19, '2024-10-22 07:32:50', '2024-10-22 07:32:50'),
(16, 19, 2001, 16, 'Shelf 2', 20, '2024-10-22 07:38:24', '2024-10-22 07:38:24'),
(17, 19, 1902, 16, 'Shelf 1', 19, '2024-10-24 06:08:31', '2024-10-24 06:08:31'),
(18, 19, 2401, 16, 'BS', 24, '2024-10-25 10:33:19', '2024-10-25 10:33:19');

-- --------------------------------------------------------

--
-- Table structure for table `stock_transfer`
--

CREATE TABLE `stock_transfer` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_transfer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_received_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_transfer_children`
--

CREATE TABLE `stock_transfer_children` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `stock_transfer_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `transfer_quantity` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_type_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `user_id`, `store_type_id`, `name`, `address`, `created_at`, `updated_at`) VALUES
(1, 2, 2, 'Kashif Company', 'Rawalpindi', '2024-07-09 05:17:16', '2024-07-09 05:17:16'),
(2, 3, 2, 'LUCKY HYDRAULIC PARTS', 'Shop#8, Adeel Market, Beside Ithihad Plaza, Tarnol, Islamabad', '2024-07-09 07:58:21', '2024-07-09 07:58:21'),
(3, 4, 2, 'ALI AUTOS', 'misrial road', '2024-07-24 12:49:05', '2024-07-24 12:49:05'),
(4, 5, 2, 'ALI AUTOS', 'rawalpindi misrail', '2024-07-24 12:51:32', '2024-07-24 12:51:32'),
(5, 6, 2, 'Ali Amin', 'Misrial Road', '2024-07-26 09:42:54', '2024-07-26 09:42:54'),
(6, 7, 2, 'Ameen Autos', 'misrail', '2024-08-02 11:19:43', '2024-08-02 11:19:43'),
(7, 8, 2, 'dasjhkdhjkas', 'dasndjkasdjkas dasnbdas', '2024-08-22 10:39:07', '2024-08-22 10:39:07'),
(8, 10, 2, 'Franklin and Scott LLC', 'Reprehenderit culpa', '2024-08-26 06:27:31', '2024-08-26 06:27:31'),
(9, 11, 2, 'ffsfsf4', 'fsf', NULL, NULL),
(10, 12, 2, '1uaua', 'yiuyiuqwey', '2024-08-30 10:41:29', '2024-08-30 10:41:29'),
(11, 13, 2, 'company', '458884888', '2024-08-30 10:50:57', '2024-08-30 10:50:57'),
(12, 14, 2, 'vsfsdfsd', 'dasdasdsa', '2024-09-26 10:16:55', '2024-09-26 10:16:55'),
(13, 15, 2, 'Adnan Bearings And Seal center', 'Aman Plaza', '2024-09-26 12:10:36', '2024-09-26 12:10:36'),
(14, 16, 2, 'dsd', 'ggfd', '2024-09-26 12:40:57', '2024-09-26 12:40:57'),
(15, 17, 2, 'fdsfsd', 'asddsadsa', '2024-09-27 09:02:46', '2024-09-27 09:02:46'),
(16, 19, 2, 'KONCEPT SOLUTIONS', 'peshawar road islamabad', '2024-10-18 07:56:11', '2024-10-18 07:56:11'),
(17, 20, 2, 'Kisan Autos', 'Haripur town', '2024-10-25 10:24:29', '2024-10-25 10:24:29'),
(18, 21, 2, 'Saad Khawaja Autos', 'dfsfsd', '2024-10-25 12:20:04', '2024-10-25 12:20:04'),
(19, 22, 2, 'Swat motors', 'Qambar bypas mingora swat', '2024-10-25 15:47:54', '2024-10-25 15:47:54'),
(20, 23, 2, 'GM Mobiles', 'Main Bazar Shinkiar', '2024-10-25 20:10:15', '2024-10-25 20:10:15'),
(21, 24, 2, 'ismail', 'katlang', '2024-10-26 17:05:54', '2024-10-26 17:05:54'),
(22, 25, 2, 'Adnan Autos 2002', 'rawalpidni peshawar road', '2024-10-28 07:03:40', '2024-10-28 07:03:40'),
(23, 26, 2, 'Tetra Pak Parts', 'Rawalpindi', '2024-10-28 11:05:02', '2024-10-28 11:05:02'),
(24, 27, 2, 'Hamza Autos', 'fowara chowk', '2024-10-28 11:30:35', '2024-10-28 11:30:35');

-- --------------------------------------------------------

--
-- Table structure for table `store_types`
--

CREATE TABLE `store_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `package_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('monthly','6months','yearly','days','weeks') NOT NULL,
  `duration` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `package_id`, `type`, `duration`, `status`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1, 2, 4, 'monthly', '1', 1, '2024-10-28', '2024-11-28', '2024-07-09 05:17:16', '2024-10-28 07:47:18'),
(2, 3, 4, 'monthly', '2', 1, '2024-10-09', '2024-11-09', '2024-07-09 07:58:21', '2024-10-09 06:23:17'),
(3, 4, 2, 'monthly', '1', 1, '2024-10-25', '2024-11-25', '2024-07-24 12:49:05', '2024-10-25 10:55:46'),
(4, 5, 1, 'monthly', '1', 0, '2024-07-24', '2024-08-24', '2024-07-24 12:51:32', '2024-09-26 10:19:56'),
(5, 6, 4, 'monthly', '1', 0, '2024-07-26', '2024-08-26', '2024-07-26 09:42:54', '2024-09-26 10:19:56'),
(6, 7, 1, 'monthly', '1', 0, '2024-08-02', '2024-09-02', '2024-08-02 11:19:43', '2024-09-26 10:19:56'),
(7, 8, 4, 'monthly', '1', 1, '2024-10-28', '2024-11-28', '2024-08-22 10:39:07', '2024-10-28 07:54:28'),
(8, 10, 4, 'monthly', '1', 1, '2024-10-28', '2024-11-28', '2024-08-26 06:27:31', '2024-10-28 07:56:37'),
(9, 11, 4, 'monthly', '1', 1, '2024-10-12', '2024-11-12', '2024-08-28 08:19:47', '2024-10-12 16:39:01'),
(10, 12, 4, 'monthly', '1', 0, '2024-08-30', '2024-09-30', '2024-08-30 10:41:29', '2024-10-03 06:42:30'),
(11, 13, 4, 'monthly', '1', 0, '2024-08-30', '2024-09-30', '2024-08-30 10:50:57', '2024-10-03 06:42:30'),
(12, 14, 2, 'monthly', '1', 1, '2024-09-26', '2025-01-31', '2024-09-26 10:16:55', '2024-10-28 07:14:55'),
(13, 15, 1, 'monthly', '1', 0, '2024-09-26', '2024-10-26', '2024-09-26 12:10:36', '2024-10-28 07:14:55'),
(14, 16, 1, 'monthly', '1', 0, '2024-09-26', '2024-10-26', '2024-09-26 12:40:57', '2024-10-28 07:14:55'),
(15, 17, 1, 'monthly', '1', 0, '2024-09-27', '2024-10-27', '2024-09-27 09:02:46', '2024-10-28 11:22:52'),
(16, 19, 1, 'monthly', '1', 1, '2024-10-18', '2024-11-18', '2024-10-18 07:56:11', '2024-10-18 08:00:28'),
(17, 20, 1, 'monthly', '1', 1, '2024-10-25', '2024-11-25', '2024-10-25 10:24:29', '2024-10-25 10:30:20'),
(18, 21, 1, 'monthly', '1', 1, '2024-10-25', '2024-11-25', '2024-10-25 12:20:04', '2024-10-28 07:14:55'),
(19, 22, 1, 'monthly', '1', 1, '2024-10-25', '2024-11-25', '2024-10-25 15:47:54', '2024-10-28 07:14:55'),
(20, 23, 1, 'monthly', '1', 1, '2024-10-26', '2024-11-26', '2024-10-25 20:10:15', '2024-10-28 07:14:55'),
(21, 24, 1, 'monthly', '1', 1, '2024-10-26', '2024-11-26', '2024-10-26 17:05:54', '2024-10-28 07:14:55'),
(22, 25, 1, 'monthly', '1', 1, '2024-10-28', '2024-11-28', '2024-10-28 07:03:40', '2024-10-28 07:14:55'),
(23, 26, 1, 'monthly', '1', 1, '2024-10-28', '2024-11-28', '2024-10-28 11:05:02', '2024-10-28 11:08:17'),
(24, 27, 1, 'monthly', '1', 1, '2024-10-28', '2024-11-28', '2024-10-28 11:30:35', '2024-10-28 11:40:08');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_type_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `user_id`, `store_type_id`, `name`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 3, 0, 'Seal Kits', 1, '2024-07-09 08:20:41', '2024-07-09 08:20:41'),
(2, 3, 0, 'PUMP PARTS', 2, '2024-07-09 09:14:42', '2024-07-09 09:14:42'),
(3, 3, 0, 'HYDRAULIC', 3, '2024-07-09 09:17:08', '2024-07-09 09:17:08'),
(4, 3, 0, 'FAN', 5, '2024-07-09 10:42:42', '2024-07-09 10:42:42'),
(5, 3, 0, 'HYDRAULIC', 6, '2024-07-10 11:41:16', '2024-07-10 11:41:16'),
(6, 3, 0, 'FUEL', 6, '2024-07-10 11:41:41', '2024-07-10 11:41:41'),
(7, 3, 0, 'OIL', 6, '2024-07-10 11:42:01', '2024-07-10 11:42:01'),
(8, 3, 0, 'PILOT', 6, '2024-07-10 11:42:17', '2024-07-10 11:42:17'),
(9, 3, 0, 'BRAKE', 6, '2024-07-10 11:42:30', '2024-07-10 11:42:30'),
(10, 3, 0, 'AIR', 6, '2024-07-10 11:42:51', '2024-07-10 11:42:51'),
(11, 3, 0, 'LOCAL', 3, '2024-07-10 12:16:43', '2024-07-10 12:16:43'),
(12, 3, 0, 'ELECTRIC PARTS', 5, '2024-07-10 12:30:45', '2024-07-10 12:30:45'),
(13, 3, 0, 'BREAKER PARTS', 3, '2024-07-10 14:28:42', '2024-07-10 14:28:42'),
(14, 3, 0, 'BERING', 3, '2024-07-12 03:43:32', '2024-07-12 03:43:32'),
(15, 3, 0, 'BUSH', 3, '2024-07-12 04:11:17', '2024-07-12 04:11:17'),
(16, 3, 0, 'ENGINE', 3, '2024-07-12 04:37:41', '2024-07-12 04:37:41'),
(17, 3, 0, 'CHAINA', 3, '2024-07-12 08:10:01', '2024-07-12 08:10:01'),
(18, 3, 0, 'BODY', 3, '2024-07-14 08:08:30', '2024-07-14 08:08:30'),
(19, 3, 0, 'OIL', 4, '2024-07-20 12:57:14', '2024-07-20 12:57:14'),
(24, 6, 0, 'Oil Filter', 10, '2024-08-05 08:34:04', '2024-08-05 08:34:04'),
(25, 6, 0, 'Front Headlight', 11, '2024-08-12 09:45:56', '2024-08-12 09:45:56'),
(26, 8, 0, 'subcategorytest', 12, '2024-08-22 10:44:34', '2024-08-22 10:44:34'),
(27, 10, 0, 'head', 13, '2024-08-26 06:48:06', '2024-08-26 06:48:06'),
(28, 11, 0, 'xcvx', 14, '2024-08-28 08:22:00', '2024-08-28 08:22:00'),
(29, 13, 0, 'fggg', 15, '2024-08-30 10:55:26', '2024-08-30 10:55:26'),
(30, 11, 0, 'Kia', 16, '2024-10-13 17:28:44', '2024-10-13 17:28:44'),
(31, 11, 0, 'Headlight', 17, '2024-10-17 05:49:23', '2024-10-17 05:49:23'),
(32, 11, 0, 'wind shield', 18, '2024-10-17 08:10:14', '2024-10-17 08:10:14'),
(33, 11, 0, 'DOR', 20, '2024-10-18 05:18:54', '2024-10-18 05:18:54'),
(34, 11, 0, 'DOR', 20, '2024-10-18 05:21:58', '2024-10-18 05:21:58'),
(35, 11, 0, 'TYRE', 20, '2024-10-18 05:36:39', '2024-10-18 05:36:39'),
(36, 19, 0, 'BIKE TYRE', 21, '2024-10-18 08:09:23', '2024-10-18 08:09:23'),
(37, 19, 0, 'WINDSHIELD', 21, '2024-10-18 11:18:11', '2024-10-18 11:18:11'),
(38, 19, 0, 'WINDSHEILD', 21, '2024-10-18 11:18:27', '2024-10-18 11:18:27'),
(39, 19, 0, 'Door', 21, '2024-10-22 07:29:37', '2024-10-22 07:29:37'),
(40, 19, 0, 'Plug', 21, '2024-10-25 10:13:39', '2024-10-25 10:13:39'),
(41, 19, 0, 'Seat Cover', 21, '2024-10-25 10:13:57', '2024-10-25 10:13:57'),
(42, 19, 0, 'Back Light', 21, '2024-10-25 10:15:23', '2024-10-25 10:15:23'),
(43, 19, 0, 'Clutch Lever', 21, '2024-10-25 10:17:27', '2024-10-25 10:17:27'),
(44, 19, 0, 'Chain Kit', 21, '2024-10-25 10:19:40', '2024-10-25 10:19:40'),
(45, 19, 0, 'Head Light', 21, '2024-10-25 10:20:18', '2024-10-25 10:20:18'),
(46, 19, 0, 'Air Filter', 21, '2024-10-25 10:20:38', '2024-10-25 10:20:38'),
(47, 19, 0, 'Plug Cap', 21, '2024-10-25 10:21:14', '2024-10-25 10:21:14'),
(48, 19, 0, 'Horn 12v', 21, '2024-10-25 10:21:51', '2024-10-25 10:21:51'),
(49, 19, 0, 'Pressure Plate', 21, '2024-10-25 10:22:46', '2024-10-25 10:22:46'),
(50, 19, 0, 'Battery 12V', 21, '2024-10-25 10:23:32', '2024-10-25 10:23:32'),
(51, 19, 0, 'Clutch Cable', 21, '2024-10-25 10:25:10', '2024-10-25 10:25:10'),
(52, 19, 0, 'Indicator', 21, '2024-10-25 10:25:48', '2024-10-25 10:25:48'),
(53, 19, 0, 'TYRE', 21, '2024-10-25 11:08:47', '2024-10-25 11:08:47'),
(54, 19, 0, 'GR 150 HEADLIGHT', 21, '2024-10-25 11:17:37', '2024-10-25 11:17:37'),
(55, 19, 0, 'GR150 COMPLETE SPEEDOMETER', 21, '2024-10-25 11:36:59', '2024-10-25 11:36:59'),
(56, 19, 0, 'GR 150 FRONT DISK PADS', 21, '2024-10-25 11:40:27', '2024-10-25 11:40:27'),
(57, 19, 0, 'Crown Brake Shoe Set', 21, '2024-10-25 12:04:27', '2024-10-25 12:04:27'),
(58, 19, 0, 'Crown Brake Shoe Set with Spring', 21, '2024-10-25 12:04:58', '2024-10-25 12:04:58'),
(59, 27, 0, 'pistion ring', 22, '2024-10-28 12:07:56', '2024-10-28 12:07:56'),
(60, 27, 0, 'Pisiton ring', 22, '2024-10-28 12:08:41', '2024-10-28 12:08:41'),
(61, 14, 0, 'gf', 25, '2024-12-17 09:18:09', '2024-12-17 09:18:09');

-- --------------------------------------------------------

--
-- Table structure for table `uoms`
--

CREATE TABLE `uoms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `uoms`
--

INSERT INTO `uoms` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, NULL, 'KG', NULL, NULL),
(2, NULL, 'Piece', NULL, NULL),
(3, NULL, 'Liter', NULL, NULL),
(4, NULL, 'Carton', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `invoice_note` text NOT NULL,
  `ntn` text DEFAULT NULL,
  `gst` text DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `auto_logout` tinyint(4) NOT NULL DEFAULT 1,
  `trial_login_at` timestamp NULL DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `admin_id` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `company_name`, `username`, `email`, `phone`, `city`, `address`, `logo`, `invoice_note`, `ntn`, `gst`, `email_verified_at`, `password`, `auto_logout`, `trial_login_at`, `is_active`, `admin_id`, `role_id`, `company_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Superadmin ', '', '', 'superadmin@example.com', '', '', '', NULL, '', NULL, NULL, NULL, '$2y$10$0XPc4iDxI46e5Jm8oE6XK.wmZldWEhKmkOjy0aEFTWZ2m2XOmSrAa', 1, NULL, 1, NULL, 1, 0, NULL, '2024-07-09 05:10:27', '2024-07-09 05:10:27'),
(2, 'kashif', 'Kashif Company', 'kashif9944', 'kashif@gmail.com', '923048765432', 'Rawalpindi', 'Rawalpindi', NULL, 'Invoice note of kashif company', '58', '15', NULL, '$2y$10$ZyUG3Sjw0BV4YgV3RqKdtOtXY2bN8Rpwup1qhX//XiEJaVoYrkr.i', 1, NULL, 1, NULL, 2, 0, NULL, '2024-07-09 05:17:16', '2024-07-09 05:17:16'),
(3, 'Daniyal', 'LUCKY HYDRAULIC PARTS', 'Arshad', 'daniyalarshad881996@gmail.com', '03120576487', 'Islamabad', 'Shop#8, Adeel Market, Beside Ithihad Plaza, Tarnol, Islamabad', '1726741570.png', 'Return & exchange within 7 days', NULL, NULL, NULL, '$2y$10$Rx.hJnKwOKIxC8V8j2dY2eylVFfKRQgyJ5bvGhExHmDFKmA5HTMJK', 1, NULL, 1, NULL, 2, 0, NULL, '2024-07-09 07:58:21', '2024-09-30 07:34:48'),
(4, 'ALi', 'ALI AUTOS', 'aliameen', 'aliameen3400@gmail.com', '343724230', 'rawalpindi', 'misrial road', NULL, '7 days return warrenty', NULL, NULL, NULL, '$2y$10$3YcmTV2IXf86.NZVcd7njO7Xo.TmYRyBfcrsg3HnpoU0dUGcMuvWa', 1, '2024-07-24 12:49:05', 1, NULL, 2, 0, NULL, '2024-07-24 12:49:05', '2024-09-09 07:52:18'),
(5, 'ALi', 'ALI AUTOS', 'ameen', 'ameali3399@gmail.com', '0318529918', 'rawalpindi', 'rawalpindi misrail', NULL, '7 days return warrenty', NULL, NULL, NULL, '$2y$10$mPsapZ5CWPq8vOzets.GI.H92clycPXRCs0XGHh1rIHWlH8.mBWeC', 1, '2024-07-24 12:51:32', 1, NULL, 2, 0, NULL, '2024-07-24 12:51:32', '2024-07-24 12:51:32'),
(6, 'Ali', 'Ali Amin', 'Amin', 'access.aliameen@gmail.com', '03134212300', 'Rawalpindi', 'Misrial Road', NULL, 'Ali ameen subscriber', NULL, NULL, NULL, '$2y$10$qCZoYPvVXTyIli6mR4XUA.bRSVaM432DU/eJYG96Qm8sFKkH6KAV.', 1, NULL, 1, NULL, 2, 0, NULL, '2024-07-26 09:42:54', '2024-07-26 09:42:54'),
(7, 'Abdulrehman', 'Ameen Autos', 'Abdulrehman01', 'buzurg.amin@gmail.com', '03185299189', 'rawalpindi', 'misrail', NULL, '7 day return warrenty', NULL, NULL, NULL, '$2y$10$ZwXZppG4PxD50.iAZHz5HOvZKtVDtFrwl8GwPNGMKBJhpt0pI8Vpa', 1, '2024-08-02 11:19:43', 1, NULL, 2, 0, NULL, '2024-08-02 11:19:43', '2024-08-02 11:19:43'),
(8, 'testuser', 'dasjhkdhjkas', 'test', 'test@example.com', '03123612312', 'duasyduias', 'dasndjkasdjkas dasnbdas', NULL, 'djasdhjkas', NULL, NULL, NULL, '$2y$10$R80EMOZg1Y3Ehnq87pQJJOnRs5wJ2j0rm36jZ3vdxuvuReDyMIxC.', 1, '2024-08-22 10:39:07', 1, NULL, 2, 0, NULL, '2024-08-22 10:39:07', '2024-08-22 10:39:07'),
(9, 'super', NULL, 'Saleman', 'super@gmail.com', '245454', 'erer', 'dfdf', NULL, '', NULL, NULL, NULL, '$2y$10$bG.igTfX471ZIatjAZn5..v4gjdV7Ln1u56rj15ZW2O.Ivh9tc1aC', 1, NULL, 1, NULL, 1, NULL, NULL, '2024-08-26 06:05:36', '2024-08-26 06:05:36'),
(10, 'Nehru Beasley', 'Franklin and Scott LLC', 'bimikufali', 'haris@gmail.com', '320', 'Duis vitae nisi accu', 'Reprehenderit culpa', NULL, 'Dolorem velit eum ut', 'Aut velit consequatu', 'Recusandae Alias ni', NULL, '$2y$10$5Yvs5V1klbHjM9KSRYOpXu.quzfohnH2TjSxK.yKPfjTqbfzJ.NBu', 1, NULL, 1, NULL, 2, NULL, NULL, '2024-08-26 06:27:31', '2024-08-26 09:53:59'),
(11, 'faizan', NULL, 'Saleman', 'faizan@gmail.com', '54454', '12345', 'rrr', '1725868187.png', '', NULL, NULL, NULL, '$2y$10$WeH0/SUm1uz6CF.oXgK4XO/i2steTeNrJWBtiAExbiy0krBDBcAx2', 1, NULL, 1, NULL, 2, NULL, NULL, '2024-08-28 08:18:09', '2024-09-09 07:49:47'),
(12, 'test', '1uaua', 'test23', 'testing@example.com', '73478327489', 'yuqyqiu', 'yiuyiuqwey', '1725014583.png', 'fdfdsfds', NULL, NULL, NULL, '$2y$10$Zg.nQTeZCi27k2agO0bmZOl0vhSJ47/6ZQu8eIvri9zvrvonMtMCy', 1, '2024-08-30 10:41:29', 1, NULL, 2, NULL, NULL, '2024-08-30 10:41:29', '2024-08-30 10:43:03'),
(13, 'zain', 'company', 'khan', 'zain@gmail.com', '455885458', '458858', '458884888', '1725017795.png', '58888', NULL, NULL, NULL, '$2y$10$Jb5SVZ95gNmyVKwXO9LeKO8orFQH36u2pPtnQ94Lkaf31wH45qthu', 1, NULL, 1, NULL, 2, NULL, NULL, '2024-08-30 10:50:57', '2024-08-30 11:36:35'),
(14, 'user', 'vsfsdfsd', 'user', 'user@gmail.com', '71273891273812', 'edasdasd', 'dasdasdsa', NULL, 'fsdfsdf', 'fsdfdsf', 'fsdfds', NULL, '$2y$10$heNncL0WmkRwsTihBrHpEuZWjThljaZLVFZ3Grg7USI6.Y48HVcPO', 1, NULL, 1, NULL, 2, NULL, NULL, '2024-09-26 10:16:55', '2024-09-26 10:16:55'),
(15, 'Asim Shaheen', 'Adnan Bearings And Seal center', 'Asimshaheen', 'asim1469@gmail.com', '03004546554', 'Tarnol', 'Aman Plaza', NULL, 'Not Valid For Court', NULL, NULL, NULL, '$2y$10$VqcTqvCYVFo09TsJU1fHPOfgZKaSZhKh.XuKgdpajaWKH1e4B9ec6', 1, NULL, 1, NULL, 2, NULL, NULL, '2024-09-26 12:10:36', '2024-09-26 12:10:36'),
(16, 'ali', 'dsd', 'ali', 'ali@gmail.com', '2234324', 'trrtr', 'ggfd', NULL, '5656', NULL, NULL, NULL, '$2y$10$YlL8F94Z8QBtr0Nj3sBAEuv1yJwkJwytjr/tx1BjLChC7GKt81C2i', 1, '2024-09-26 12:40:57', 1, NULL, 2, NULL, NULL, '2024-09-26 12:40:57', '2024-09-26 12:40:57'),
(17, 'testing123', 'fdsfsd', 'testing123', 'testing123@gmail.com', '442343423', 'sdadasdsasda', 'asddsadsa', NULL, 'fdfsdf', 'fdsfsdfsd', 'zfdds', NULL, '$2y$10$/QBcQo1VrndbI2foBg3T3ewXOz5Kr7q7.xRO70U7PpOgeItXrFxsq', 1, '2024-09-27 09:02:46', 1, NULL, 2, NULL, NULL, '2024-09-27 09:02:46', '2024-09-27 09:02:46'),
(18, 'kashif Khan', NULL, 'Saleman', 'M.kashif205khan@gmail.com', '03115455205', 'Rawalpindi', 'Lucky Autos', NULL, '', NULL, NULL, NULL, '$2y$10$XygIctNF/eLBWgc9YNEvD.U31IKEvGg6G2JZiMXFacXNkbHu8.QC.', 1, NULL, 1, 3, 3, NULL, NULL, '2024-09-30 07:32:33', '2024-09-30 07:32:33'),
(19, 'MUHAMMAD ILYAS', 'KONCEPT SOLUTIONS', 'ilyas121', 'ilyasawan037@gmail.com', '03013052930', 'islamabad', 'peshawar road islamabad', NULL, 'ILYAS', NULL, NULL, NULL, '$2y$10$/EBwzfRhZvY3RDvzWb.t1.PfRIrRtSu7IBggOfqRxGlusrbl7GKjG', 1, '2024-10-18 07:56:11', 1, NULL, 2, NULL, NULL, '2024-10-18 07:56:11', '2024-10-18 07:56:11'),
(20, 'Azhar Hussain', 'Kisan Autos', 'AzharHussainshah2', 'azhar.hussain.shah2@gmail.com', '03043914664', 'Haripur', 'Haripur town', NULL, 'azhar shah', NULL, NULL, NULL, '$2y$10$RRN5M61C/WpQEJrJNfO8cuSEDufwkiIlSnz.auwjzFz3snVpDc0ES', 1, '2024-10-25 10:24:29', 1, NULL, 2, NULL, NULL, '2024-10-25 10:24:29', '2024-10-25 10:24:29'),
(21, 'Saad', 'Saad Khawaja Autos', 'dfsdfd', 'saadfdfdd@gmail.com', '0333333333', 'rawalpindi', 'dfsfsd', NULL, 'dfsfas', NULL, NULL, NULL, '$2y$10$/3kC9lk9qwRhTr4vdXlPKO2DIPIbbTNtZWD5eUBBZ5VQkN6pdSKm2', 1, '2024-10-25 12:20:04', 1, NULL, 2, NULL, NULL, '2024-10-25 12:20:04', '2024-10-25 12:20:04'),
(22, 'Zishan', 'Swat motors', 'Khanzishan', 'khanzishan625@gmail.com', '03429661743', 'Mingora', 'Qambar bypas mingora swat', NULL, 'Same as above', 'N/A', 'N/A', NULL, '$2y$10$phzY74O2ZtFlfYH0GI0c1OOZGdf8VGPHbBrdSTiJfPkks9PY4IVM2', 1, '2024-10-25 15:47:54', 1, NULL, 2, NULL, NULL, '2024-10-25 15:47:54', '2024-10-25 15:47:54'),
(23, 'Kashif', 'GM Mobiles', 'Kashijee345', 'gmsweets2000@gmail.com', '03455446665', 'Manshera', 'Main Bazar Shinkiar', '1729887014.png', 'No', NULL, NULL, NULL, '$2y$10$.1ZGqfb2k5ul2ISuuFS6pOMaWLEsCgGkWntp2GV7k1sbfNu1AlFn.', 1, '2024-10-25 20:10:15', 1, NULL, 2, NULL, NULL, '2024-10-25 20:10:15', '2024-10-25 20:10:15'),
(24, 'yaseen khan', 'ismail', 'yaseen khan', 'yk1993486@gmail.com', '03414331184', 'mardan', 'katlang', NULL, 'ggg', 'ggg', NULL, NULL, '$2y$10$tOe27BELKJ8Evo2fRLIgAuP76w6UE.GwEmkswSkxnarYw1Q0PCmV6', 1, '2024-10-26 17:05:54', 1, NULL, 2, NULL, NULL, '2024-10-26 17:05:54', '2024-10-26 17:05:54'),
(25, 'adnan', 'Adnan Autos 2002', 'adnan 2002', 'adnan2323@gmail.com', '03333333333', 'rawalpindi', 'rawalpidni peshawar road', NULL, '7 days return warrenty', NULL, NULL, NULL, '$2y$10$t49YveAT2cBDYy1wKtdzNuV0rEq.maocY32vudqRBSvBAa/K7o/5a', 1, '2024-10-28 07:03:40', 1, NULL, 2, NULL, NULL, '2024-10-28 07:03:40', '2024-10-28 07:03:40'),
(26, 'Muhammad Ehsan', 'Tetra Pak Parts', 'Muhammadehsan10', 'muhammadehsantopsfood@gmail.com', '03010155503', 'Rawalpindi', 'Rawalpindi', NULL, '7 Days Return Warienty', NULL, NULL, NULL, '$2y$10$LRxFlYgFtKQLMfQtkYAdq.zb.h61CqxqTE3SGOg015A3sb8ZeVbQ6', 1, '2024-10-28 11:05:02', 1, NULL, 2, NULL, NULL, '2024-10-28 11:05:02', '2024-10-28 11:05:02'),
(27, 'imran', 'Hamza Autos', 'imran khan', 'ik148250@gmail.com', '03165909512', 'abbottabad', 'fowara chowk', NULL, '6 day', 'D826409-2', NULL, NULL, '$2y$10$aypYfsoCSc5aI30fwyES2uwUxjkO5uAzMX.09ue0.qVHQiKXzt05e', 1, '2024-10-28 11:30:35', 1, NULL, 2, NULL, NULL, '2024-10-28 11:30:35', '2024-10-28 11:30:35');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL,
  `type` tinyint(4) NOT NULL COMMENT 'payment = 1, receipt = 2, JV = 3',
  `name` varchar(255) DEFAULT NULL,
  `voucher_no` bigint(20) NOT NULL,
  `purchase_order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `adjust_inventory_id` int(11) DEFAULT NULL,
  `date` date NOT NULL DEFAULT '2024-07-09',
  `total_amount` double NOT NULL,
  `cheque_no` varchar(255) DEFAULT NULL,
  `cheque_date` date DEFAULT NULL,
  `isApproved` tinyint(4) NOT NULL DEFAULT 0,
  `is_post_dated` tinyint(4) NOT NULL DEFAULT 0,
  `cleared_date` timestamp NULL DEFAULT NULL,
  `is_auto` tinyint(4) NOT NULL DEFAULT 0,
  `generated_at` date DEFAULT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `returned_sales_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `return_invoice_id` int(11) DEFAULT NULL,
  `return_po_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `user_id`, `person_id`, `type`, `name`, `voucher_no`, `purchase_order_id`, `adjust_inventory_id`, `date`, `total_amount`, `cheque_no`, `cheque_date`, `isApproved`, `is_post_dated`, `cleared_date`, `is_auto`, `generated_at`, `booking_id`, `invoice_id`, `returned_sales_id`, `created_at`, `updated_at`, `deleted_at`, `return_invoice_id`, `return_po_id`) VALUES
(1, 14, NULL, 3, 'Purchase Order Number: 1', 1, 1, NULL, '2024-12-17', 27600, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 09:35:34', '2024-12-17 09:35:34', NULL, NULL, NULL),
(2, 14, NULL, 3, 'Purchase Order Number: 2', 2, 2, NULL, '2024-12-17', 41260, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL, NULL, NULL),
(3, 14, NULL, 3, 'Add Adjust Inventory', 3, NULL, 1, '2024-12-17', 3595, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL, NULL, NULL),
(4, 14, NULL, 3, 'Dispose Adjust Inventory', 4, NULL, 2, '2024-12-17', 460, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL, NULL, NULL),
(5, 14, NULL, 3, 'Inventory Cost Out, Invoice no: INO-1', 5, NULL, NULL, '2024-12-17', 35997.5, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, 1, NULL, '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL, NULL, NULL),
(6, 14, NULL, 2, 'Revenue Generated ,Invoice no: INO-1', 1, NULL, NULL, '2024-12-17', 200, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, 1, NULL, '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL, NULL, NULL),
(7, 14, NULL, 3, 'Return Voucher Inventory Cost Reversed, Invoice no: INO-1', 6, NULL, NULL, '2024-12-17', 7199.5, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:04:18', '2024-12-17 12:04:18', NULL, 1, NULL),
(8, 14, NULL, 2, 'Revenue Reversed For Return Invoice ,Invoice no: INO-1', 2, NULL, NULL, '2024-12-17', 40, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:04:18', '2024-12-17 12:04:18', NULL, 1, NULL),
(9, 14, NULL, 3, 'Inventory Cost Out, Invoice no: INO-2', 7, NULL, NULL, '2024-12-17', 8999.375, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, 2, NULL, '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL, NULL, NULL),
(10, 14, NULL, 2, 'Revenue Generated ,Invoice no: INO-2', 3, NULL, NULL, '2024-12-17', 2755, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, 2, NULL, '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL, NULL, NULL),
(11, 14, NULL, 3, 'Add Adjust Inventory', 8, NULL, 3, '2024-12-17', 625, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:07:07', '2024-12-17 12:07:07', NULL, NULL, NULL),
(12, 14, NULL, 3, 'Return Voucher Inventory Cost Reversed, Invoice no: INO-2', 9, NULL, NULL, '2024-12-17', 2374.2698863637, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:48:54', '2024-12-17 12:48:54', NULL, 2, NULL),
(13, 14, NULL, 2, 'Revenue Reversed For Return Invoice ,Invoice no: INO-2', 4, NULL, NULL, '2024-12-17', 1653, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:48:54', '2024-12-17 12:48:54', NULL, 2, NULL),
(14, 14, NULL, 3, 'Return Voucher Inventory Cost Reversed, Invoice no: INO-1', 10, NULL, NULL, '2024-12-17', 11871.349431818, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:49:51', '2024-12-17 12:49:51', NULL, 3, NULL),
(15, 14, NULL, 2, 'Revenue Reversed For Return Invoice ,Invoice no: INO-1', 5, NULL, NULL, '2024-12-17', 150, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:49:51', '2024-12-17 12:49:51', NULL, 3, NULL),
(16, 14, NULL, 3, 'Add Adjust Inventory', 11, NULL, 4, '2024-12-17', 25, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:50:31', '2024-12-17 12:50:31', NULL, NULL, NULL),
(17, 14, NULL, 3, 'Return Voucher Inventory Cost Reversed, Invoice no: INO-2', 12, NULL, NULL, '2024-12-17', 3599.75, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:51:16', '2024-12-17 12:51:16', NULL, 4, NULL),
(18, 14, NULL, 2, 'Revenue Reversed For Return Invoice ,Invoice no: INO-2', 6, NULL, NULL, '2024-12-17', 1102, NULL, NULL, 1, 0, NULL, 1, '2024-12-17', NULL, NULL, NULL, '2024-12-17 12:51:16', '2024-12-17 12:51:16', NULL, 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `voucher_transactions`
--

CREATE TABLE `voucher_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `voucher_id` bigint(20) UNSIGNED NOT NULL,
  `coa_account_id` bigint(20) UNSIGNED NOT NULL,
  `debit` double(15,2) NOT NULL DEFAULT 0.00,
  `credit` double(15,2) NOT NULL DEFAULT 0.00,
  `balance` double(15,2) NOT NULL DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `land_id` bigint(20) UNSIGNED DEFAULT NULL,
  `land_payment_head_id` int(10) UNSIGNED DEFAULT NULL,
  `plot_id` bigint(20) UNSIGNED DEFAULT NULL,
  `person_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_approved` tinyint(4) NOT NULL DEFAULT 0,
  `is_post_dated` tinyint(4) NOT NULL DEFAULT 0,
  `salary_slip_id` bigint(20) UNSIGNED DEFAULT NULL,
  `loan_amortization_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voucher_transactions`
--

INSERT INTO `voucher_transactions` (`id`, `user_id`, `voucher_id`, `coa_account_id`, `debit`, `credit`, `balance`, `description`, `land_id`, `land_payment_head_id`, `plot_id`, `person_id`, `is_approved`, `is_post_dated`, `salary_slip_id`, `loan_amortization_id`, `date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 14, 1, 1, 27600.00, 0.00, 0.00, ' PO: 1 Inventory Added ,OWNER CAPITAL65/45645/fdg/, Qty 10 , Rate 2750, Cost:  100', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:35:34', '2024-12-17 09:35:34', NULL),
(2, 14, 1, 369, 0.00, 27500.00, 0.00, ' PO: 1  dsf Liability Created', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:35:34', '2024-12-17 09:35:34', NULL),
(3, 14, 1, 370, 0.00, 100.00, 0.00, 'Dispose Inventory333', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:35:34', '2024-12-17 09:35:34', NULL),
(4, 14, 2, 1, 13753.33, 0.00, 0.00, ' PO: 2 Inventory Added ,OWNER CAPITAL65/45645/fdg/, Qty 5 , Rate 2750, Cost:  3.3333333333333', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL),
(5, 14, 2, 1, 27506.67, 0.00, 0.00, ' PO: 2 Inventory Added ,OWNER CAPITAL65/45645/fdg/, Qty 10 , Rate 2750, Cost:  6.6666666666667', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL),
(6, 14, 2, 369, 0.00, 41250.00, 0.00, ' PO: 2  dsf Liability Created', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL),
(7, 14, 2, 370, 0.00, 10.00, 0.00, 'dd', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:37:45', '2024-12-17 09:37:45', NULL),
(8, 14, 3, 1, 1020.00, 0.00, 0.00, 'Item: OWNER CAPITAL65/45645/fdg/, Qty:10, Rate: 102', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL),
(9, 14, 3, 1, 2575.00, 0.00, 0.00, 'Item: OWNER CAPITAL65/45645/fdg/, Qty:25, Rate: 103', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL),
(10, 14, 3, 182, 0.00, 3595.00, 0.00, 'Add Adjust Inventory:', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:38:36', '2024-12-17 09:38:36', NULL),
(11, 14, 4, 1, 0.00, 250.00, 0.00, 'Item: OWNER CAPITAL65/45645/fdg/, Qty:10, Rate: 25', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL),
(12, 14, 4, 1, 0.00, 210.00, 0.00, 'Item: OWNER CAPITAL65/45645/fdg/, Qty:10, Rate: 21', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL),
(13, 14, 4, 183, 460.00, 0.00, 0.00, 'Dispose Adjust Inventory:', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 09:42:37', '2024-12-17 09:42:37', NULL),
(14, 14, 5, 1, 0.00, 35997.50, 0.00, 'OWNER CAPITAL65/45645/fdg/ Inventory Sold. Avg Cost:1800 , Qty 20 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL),
(15, 14, 5, 3, 35997.50, 0.00, 0.00, 'OWNER CAPITAL65/45645/fdg/ Inventory Sold. Avg Cost:1800 , Qty 20 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL),
(16, 14, 6, 4, 0.00, 200.00, 0.00, 'OWNER CAPITAL65/45645/fdg/ revenue . Rate: 10 , Qty 20 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL),
(17, 14, 6, 371, 200.00, 0.00, 0.00, 'Invoice no: INO-1 Cash Received', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 11:37:00', '2024-12-17 11:37:00', NULL),
(18, 14, 7, 1, 7199.50, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:1800 , Qty 4 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:04:18', '2024-12-17 12:04:18', NULL),
(19, 14, 7, 3, 0.00, 7199.50, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:1800 , Qty 4 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:04:18', '2024-12-17 12:04:18', NULL),
(20, 14, 8, 4, 40.00, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/Batch NO. revenue reversed . Rate:  , Qty 4 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:04:18', '2024-12-17 12:04:18', NULL),
(21, 14, 8, 371, 0.00, 40.00, 0.00, 'Invoice no: INO-1 Cash Paid ', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:04:18', '2024-12-17 12:04:18', NULL),
(22, 14, 9, 1, 0.00, 8999.38, 0.00, 'OWNER CAPITAL65/45645/fdg/ Inventory Sold. Avg Cost:1800 , Qty 5 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL),
(23, 14, 9, 3, 8999.38, 0.00, 0.00, 'OWNER CAPITAL65/45645/fdg/ Inventory Sold. Avg Cost:1800 , Qty 5 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL),
(24, 14, 10, 4, 0.00, 2755.00, 0.00, 'OWNER CAPITAL65/45645/fdg/ revenue . Rate: 551 , Qty 5 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL),
(25, 14, 10, 371, 2755.00, 0.00, 0.00, 'Invoice no: INO-2 Cash Received', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:05:51', '2024-12-17 12:05:51', NULL),
(26, 14, 11, 1, 625.00, 0.00, 0.00, 'Item: OWNER CAPITAL65/45645/fdg/, Qty:25, Rate: 25', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:07:07', '2024-12-17 12:07:07', NULL),
(27, 14, 11, 182, 0.00, 625.00, 0.00, 'Add Adjust Inventory:', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:07:07', '2024-12-17 12:07:07', NULL),
(28, 14, 12, 1, 2374.27, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:791 , Qty 3 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:48:54', '2024-12-17 12:48:54', NULL),
(29, 14, 12, 3, 0.00, 2374.27, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:791 , Qty 3 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:48:54', '2024-12-17 12:48:54', NULL),
(30, 14, 13, 4, 30.00, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/Batch NO. revenue reversed . Rate:  , Qty 3 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:48:54', '2024-12-17 12:48:54', NULL),
(31, 14, 13, 371, 0.00, 1653.00, 0.00, 'Invoice no: INO-2 Cash Paid ', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:48:54', '2024-12-17 12:48:54', NULL),
(32, 14, 14, 1, 11871.35, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:791 , Qty 15 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:49:51', '2024-12-17 12:49:51', NULL),
(33, 14, 14, 3, 0.00, 11871.35, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:791 , Qty 15 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:49:51', '2024-12-17 12:49:51', NULL),
(34, 14, 15, 4, 150.00, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/Batch NO. revenue reversed . Rate:  , Qty 15 ,Invoice no: INO-1', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:49:51', '2024-12-17 12:49:51', NULL),
(35, 14, 15, 371, 0.00, 150.00, 0.00, 'Invoice no: INO-1 Cash Paid ', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:49:51', '2024-12-17 12:49:51', NULL),
(36, 14, 16, 1, 25.00, 0.00, 0.00, 'Item: OWNER CAPITAL65/45645/fdg/, Qty:5, Rate: 5', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:50:31', '2024-12-17 12:50:31', NULL),
(37, 14, 16, 182, 0.00, 25.00, 0.00, 'Add Adjust Inventory:', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:50:31', '2024-12-17 12:50:31', NULL),
(38, 14, 17, 1, 3599.75, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:1800 , Qty 2 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:51:16', '2024-12-17 12:51:16', NULL),
(39, 14, 17, 3, 0.00, 3599.75, 0.00, '534-OWNER CAPITAL65/45645/fdg/ Inventory Returned. Avg Cost:1800 , Qty 2 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:51:16', '2024-12-17 12:51:16', NULL),
(40, 14, 18, 4, 1102.00, 0.00, 0.00, '534-OWNER CAPITAL65/45645/fdg/Batch NO. revenue reversed . Rate:  , Qty 2 ,Invoice no: INO-2', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:51:16', '2024-12-17 12:51:16', NULL),
(41, 14, 18, 371, 0.00, 1102.00, 0.00, 'Invoice no: INO-2 Cash Paid ', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '2024-12-16 19:00:00', '2024-12-17 12:51:16', '2024-12-17 12:51:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `voucher_types`
--

CREATE TABLE `voucher_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voucher_types`
--

INSERT INTO `voucher_types` (`id`, `user_id`, `name`, `created_at`, `updated_at`) VALUES
(1, NULL, 'PV', NULL, NULL),
(2, NULL, 'RV', NULL, NULL),
(3, NULL, 'JV', NULL, NULL),
(4, NULL, 'CV', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adjust_inventories`
--
ALTER TABLE `adjust_inventories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adjust_inventory_children`
--
ALTER TABLE `adjust_inventory_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adjust_inventory_children_adjust_inventory_id_foreign` (`adjust_inventory_id`),
  ADD KEY `adjust_inventory_children_item_id_foreign` (`item_id`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `applications_user_id_foreign` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_user_id_foreign` (`user_id`);

--
-- Indexes for table `coa_accounts`
--
ALTER TABLE `coa_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coa_accounts_user_id_foreign` (`user_id`);

--
-- Indexes for table `coa_groups`
--
ALTER TABLE `coa_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coa_groups_user_id_foreign` (`user_id`);

--
-- Indexes for table `coa_sub_groups`
--
ALTER TABLE `coa_sub_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coa_sub_groups_user_id_foreign` (`user_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companies_user_id_foreign` (`user_id`);

--
-- Indexes for table `companies_oem_part_nos`
--
ALTER TABLE `companies_oem_part_nos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companies_oem_part_nos_user_id_foreign` (`user_id`);

--
-- Indexes for table `dimensions`
--
ALTER TABLE `dimensions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dimensions_user_id_foreign` (`user_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_user_id_foreign` (`user_id`);

--
-- Indexes for table `expense_types`
--
ALTER TABLE `expense_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `inventory_types`
--
ALTER TABLE `inventory_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoices_user_id_foreign` (`user_id`);

--
-- Indexes for table `invoice_children`
--
ALTER TABLE `invoice_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_children_user_id_foreign` (`user_id`);

--
-- Indexes for table `item_inventory`
--
ALTER TABLE `item_inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_inventory_user_id_foreign` (`user_id`);

--
-- Indexes for table `item_oem_part_model`
--
ALTER TABLE `item_oem_part_model`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_oem_part_model_user_id_foreign` (`user_id`);

--
-- Indexes for table `item_oem_part_model_item`
--
ALTER TABLE `item_oem_part_model_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_oem_part_model_item_user_id_foreign` (`user_id`);

--
-- Indexes for table `item_rack_shelves`
--
ALTER TABLE `item_rack_shelves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_rack_shelves_user_id_foreign` (`user_id`);

--
-- Indexes for table `kit_child`
--
ALTER TABLE `kit_child`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kit_child_user_id_foreign` (`user_id`);

--
-- Indexes for table `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machines_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_item_parts`
--
ALTER TABLE `machine_item_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_item_parts_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_models`
--
ALTER TABLE `machine_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_models_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_parts`
--
ALTER TABLE `machine_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_parts_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_part_models`
--
ALTER TABLE `machine_part_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_part_models_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_part_oem_dimensions`
--
ALTER TABLE `machine_part_oem_dimensions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_part_oem_dimensions_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_part_oem_part_model_company`
--
ALTER TABLE `machine_part_oem_part_model_company`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_part_oem_part_model_company_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_part_oem_part_nos`
--
ALTER TABLE `machine_part_oem_part_nos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_part_oem_part_nos_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_part_oem_part_nos_machine_models`
--
ALTER TABLE `machine_part_oem_part_nos_machine_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_part_oem_part_nos_machine_models_user_id_foreign` (`user_id`);

--
-- Indexes for table `machine_part_types`
--
ALTER TABLE `machine_part_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_part_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `makes`
--
ALTER TABLE `makes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `makes_user_id_foreign` (`user_id`);

--
-- Indexes for table `make_item_parts`
--
ALTER TABLE `make_item_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `make_item_parts_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_item_parts`
--
ALTER TABLE `model_item_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `model_item_parts_user_id_foreign` (`user_id`);

--
-- Indexes for table `oem_part_nos`
--
ALTER TABLE `oem_part_nos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oem_part_nos_user_id_foreign` (`user_id`);

--
-- Indexes for table `origins`
--
ALTER TABLE `origins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `origins_user_id_foreign` (`user_id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`id`),
  ADD KEY `people_user_id_foreign` (`user_id`);

--
-- Indexes for table `people_person_types`
--
ALTER TABLE `people_person_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `people_person_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `person_types`
--
ALTER TABLE `person_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `purchase_order_children`
--
ALTER TABLE `purchase_order_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_order_children_user_id_foreign` (`user_id`);

--
-- Indexes for table `racks`
--
ALTER TABLE `racks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `racks_user_id_foreign` (`user_id`);

--
-- Indexes for table `returned_purchase_orders`
--
ALTER TABLE `returned_purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `returned_purchase_orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `returned_purchase_order_children`
--
ALTER TABLE `returned_purchase_order_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `returned_purchase_order_children_user_id_foreign` (`user_id`);

--
-- Indexes for table `returned_sales`
--
ALTER TABLE `returned_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `returned_sales_user_id_foreign` (`user_id`);

--
-- Indexes for table `returned_sale_children`
--
ALTER TABLE `returned_sale_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `returned_sale_children_user_id_foreign` (`user_id`);

--
-- Indexes for table `return_rack_shelves`
--
ALTER TABLE `return_rack_shelves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `return_rack_shelves_user_id_foreign` (`user_id`);

--
-- Indexes for table `return_sale_rack_shelves`
--
ALTER TABLE `return_sale_rack_shelves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `return_sale_rack_shelves_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_histories`
--
ALTER TABLE `sale_histories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_rack_shelves`
--
ALTER TABLE `sale_rack_shelves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_rack_shelves_user_id_foreign` (`user_id`);

--
-- Indexes for table `shelves`
--
ALTER TABLE `shelves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shelves_user_id_foreign` (`user_id`);

--
-- Indexes for table `stock_transfer`
--
ALTER TABLE `stock_transfer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_transfer_user_id_foreign` (`user_id`);

--
-- Indexes for table `stock_transfer_children`
--
ALTER TABLE `stock_transfer_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_transfer_children_user_id_foreign` (`user_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stores_user_id_foreign` (`user_id`);

--
-- Indexes for table `store_types`
--
ALTER TABLE `store_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_types_user_id_foreign` (`user_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscriptions_user_id_foreign` (`user_id`),
  ADD KEY `subscriptions_package_id_foreign` (`package_id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sub_categories_user_id_foreign` (`user_id`);

--
-- Indexes for table `uoms`
--
ALTER TABLE `uoms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uoms_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vouchers_user_id_foreign` (`user_id`);

--
-- Indexes for table `voucher_transactions`
--
ALTER TABLE `voucher_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `voucher_transactions_user_id_foreign` (`user_id`);

--
-- Indexes for table `voucher_types`
--
ALTER TABLE `voucher_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `voucher_types_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adjust_inventories`
--
ALTER TABLE `adjust_inventories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `adjust_inventory_children`
--
ALTER TABLE `adjust_inventory_children`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `coa_accounts`
--
ALTER TABLE `coa_accounts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=372;

--
-- AUTO_INCREMENT for table `coa_groups`
--
ALTER TABLE `coa_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `coa_sub_groups`
--
ALTER TABLE `coa_sub_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `companies_oem_part_nos`
--
ALTER TABLE `companies_oem_part_nos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dimensions`
--
ALTER TABLE `dimensions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expense_types`
--
ALTER TABLE `expense_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_types`
--
ALTER TABLE `inventory_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invoice_children`
--
ALTER TABLE `invoice_children`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `item_inventory`
--
ALTER TABLE `item_inventory`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `item_oem_part_model`
--
ALTER TABLE `item_oem_part_model`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_oem_part_model_item`
--
ALTER TABLE `item_oem_part_model_item`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_rack_shelves`
--
ALTER TABLE `item_rack_shelves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kit_child`
--
ALTER TABLE `kit_child`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `machines`
--
ALTER TABLE `machines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `machine_item_parts`
--
ALTER TABLE `machine_item_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=549;

--
-- AUTO_INCREMENT for table `machine_models`
--
ALTER TABLE `machine_models`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `machine_parts`
--
ALTER TABLE `machine_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT for table `machine_part_models`
--
ALTER TABLE `machine_part_models`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `machine_part_oem_dimensions`
--
ALTER TABLE `machine_part_oem_dimensions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `machine_part_oem_part_model_company`
--
ALTER TABLE `machine_part_oem_part_model_company`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `machine_part_oem_part_nos`
--
ALTER TABLE `machine_part_oem_part_nos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=550;

--
-- AUTO_INCREMENT for table `machine_part_oem_part_nos_machine_models`
--
ALTER TABLE `machine_part_oem_part_nos_machine_models`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=535;

--
-- AUTO_INCREMENT for table `machine_part_types`
--
ALTER TABLE `machine_part_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `makes`
--
ALTER TABLE `makes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `make_item_parts`
--
ALTER TABLE `make_item_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=563;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `model_item_parts`
--
ALTER TABLE `model_item_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=673;

--
-- AUTO_INCREMENT for table `oem_part_nos`
--
ALTER TABLE `oem_part_nos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=550;

--
-- AUTO_INCREMENT for table `origins`
--
ALTER TABLE `origins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `people`
--
ALTER TABLE `people`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `people_person_types`
--
ALTER TABLE `people_person_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `person_types`
--
ALTER TABLE `person_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchase_order_children`
--
ALTER TABLE `purchase_order_children`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `racks`
--
ALTER TABLE `racks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `returned_purchase_orders`
--
ALTER TABLE `returned_purchase_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `returned_purchase_order_children`
--
ALTER TABLE `returned_purchase_order_children`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `returned_sales`
--
ALTER TABLE `returned_sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `returned_sale_children`
--
ALTER TABLE `returned_sale_children`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `return_rack_shelves`
--
ALTER TABLE `return_rack_shelves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `return_sale_rack_shelves`
--
ALTER TABLE `return_sale_rack_shelves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sale_histories`
--
ALTER TABLE `sale_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale_rack_shelves`
--
ALTER TABLE `sale_rack_shelves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shelves`
--
ALTER TABLE `shelves`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `stock_transfer`
--
ALTER TABLE `stock_transfer`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_transfer_children`
--
ALTER TABLE `stock_transfer_children`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `store_types`
--
ALTER TABLE `store_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `uoms`
--
ALTER TABLE `uoms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `voucher_transactions`
--
ALTER TABLE `voucher_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `voucher_types`
--
ALTER TABLE `voucher_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coa_accounts`
--
ALTER TABLE `coa_accounts`
  ADD CONSTRAINT `coa_accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coa_groups`
--
ALTER TABLE `coa_groups`
  ADD CONSTRAINT `coa_groups_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coa_sub_groups`
--
ALTER TABLE `coa_sub_groups`
  ADD CONSTRAINT `coa_sub_groups_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `companies_oem_part_nos`
--
ALTER TABLE `companies_oem_part_nos`
  ADD CONSTRAINT `companies_oem_part_nos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dimensions`
--
ALTER TABLE `dimensions`
  ADD CONSTRAINT `dimensions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expense_types`
--
ALTER TABLE `expense_types`
  ADD CONSTRAINT `expense_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory_types`
--
ALTER TABLE `inventory_types`
  ADD CONSTRAINT `inventory_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_children`
--
ALTER TABLE `invoice_children`
  ADD CONSTRAINT `invoice_children_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_inventory`
--
ALTER TABLE `item_inventory`
  ADD CONSTRAINT `item_inventory_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_oem_part_model`
--
ALTER TABLE `item_oem_part_model`
  ADD CONSTRAINT `item_oem_part_model_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_oem_part_model_item`
--
ALTER TABLE `item_oem_part_model_item`
  ADD CONSTRAINT `item_oem_part_model_item_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `item_rack_shelves`
--
ALTER TABLE `item_rack_shelves`
  ADD CONSTRAINT `item_rack_shelves_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kit_child`
--
ALTER TABLE `kit_child`
  ADD CONSTRAINT `kit_child_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machines`
--
ALTER TABLE `machines`
  ADD CONSTRAINT `machines_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_item_parts`
--
ALTER TABLE `machine_item_parts`
  ADD CONSTRAINT `machine_item_parts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_models`
--
ALTER TABLE `machine_models`
  ADD CONSTRAINT `machine_models_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_parts`
--
ALTER TABLE `machine_parts`
  ADD CONSTRAINT `machine_parts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_part_models`
--
ALTER TABLE `machine_part_models`
  ADD CONSTRAINT `machine_part_models_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_part_oem_dimensions`
--
ALTER TABLE `machine_part_oem_dimensions`
  ADD CONSTRAINT `machine_part_oem_dimensions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_part_oem_part_model_company`
--
ALTER TABLE `machine_part_oem_part_model_company`
  ADD CONSTRAINT `machine_part_oem_part_model_company_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_part_oem_part_nos`
--
ALTER TABLE `machine_part_oem_part_nos`
  ADD CONSTRAINT `machine_part_oem_part_nos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_part_oem_part_nos_machine_models`
--
ALTER TABLE `machine_part_oem_part_nos_machine_models`
  ADD CONSTRAINT `machine_part_oem_part_nos_machine_models_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `machine_part_types`
--
ALTER TABLE `machine_part_types`
  ADD CONSTRAINT `machine_part_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `makes`
--
ALTER TABLE `makes`
  ADD CONSTRAINT `makes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `make_item_parts`
--
ALTER TABLE `make_item_parts`
  ADD CONSTRAINT `make_item_parts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_item_parts`
--
ALTER TABLE `model_item_parts`
  ADD CONSTRAINT `model_item_parts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `oem_part_nos`
--
ALTER TABLE `oem_part_nos`
  ADD CONSTRAINT `oem_part_nos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `origins`
--
ALTER TABLE `origins`
  ADD CONSTRAINT `origins_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `people`
--
ALTER TABLE `people`
  ADD CONSTRAINT `people_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `people_person_types`
--
ALTER TABLE `people_person_types`
  ADD CONSTRAINT `people_person_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `person_types`
--
ALTER TABLE `person_types`
  ADD CONSTRAINT `person_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_children`
--
ALTER TABLE `purchase_order_children`
  ADD CONSTRAINT `purchase_order_children_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `racks`
--
ALTER TABLE `racks`
  ADD CONSTRAINT `racks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `returned_purchase_orders`
--
ALTER TABLE `returned_purchase_orders`
  ADD CONSTRAINT `returned_purchase_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `returned_purchase_order_children`
--
ALTER TABLE `returned_purchase_order_children`
  ADD CONSTRAINT `returned_purchase_order_children_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `returned_sales`
--
ALTER TABLE `returned_sales`
  ADD CONSTRAINT `returned_sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `returned_sale_children`
--
ALTER TABLE `returned_sale_children`
  ADD CONSTRAINT `returned_sale_children_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `return_rack_shelves`
--
ALTER TABLE `return_rack_shelves`
  ADD CONSTRAINT `return_rack_shelves_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `return_sale_rack_shelves`
--
ALTER TABLE `return_sale_rack_shelves`
  ADD CONSTRAINT `return_sale_rack_shelves_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sale_rack_shelves`
--
ALTER TABLE `sale_rack_shelves`
  ADD CONSTRAINT `sale_rack_shelves_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shelves`
--
ALTER TABLE `shelves`
  ADD CONSTRAINT `shelves_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_transfer`
--
ALTER TABLE `stock_transfer`
  ADD CONSTRAINT `stock_transfer_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_transfer_children`
--
ALTER TABLE `stock_transfer_children`
  ADD CONSTRAINT `stock_transfer_children_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `store_types`
--
ALTER TABLE `store_types`
  ADD CONSTRAINT `store_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `uoms`
--
ALTER TABLE `uoms`
  ADD CONSTRAINT `uoms_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `vouchers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `voucher_transactions`
--
ALTER TABLE `voucher_transactions`
  ADD CONSTRAINT `voucher_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `voucher_types`
--
ALTER TABLE `voucher_types`
  ADD CONSTRAINT `voucher_types_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
