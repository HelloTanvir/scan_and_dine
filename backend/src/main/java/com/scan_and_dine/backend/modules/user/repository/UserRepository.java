package com.scan_and_dine.backend.modules.user.repository;

import com.scan_and_dine.backend.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query(value = "SELECT * FROM users u WHERE " +
           "u.role != 'ADMIN' AND " +
           "(:username IS NULL OR UPPER(u.username) ILIKE UPPER('%' || :username || '%')) AND " +
           "(:email IS NULL OR UPPER(u.email) ILIKE UPPER('%' || :email || '%')) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status)",
           nativeQuery = true)
    Page<User> findUsersWithFilters(@Param("username") String username,
                                   @Param("email") String email,
                                   @Param("role") String role,
                                   @Param("status") String status,
                                   Pageable pageable);
} 