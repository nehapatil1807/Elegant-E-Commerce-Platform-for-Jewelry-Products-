package com.cdac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.modal.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
