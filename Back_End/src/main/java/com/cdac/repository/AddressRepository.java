package com.cdac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cdac.modal.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

}
