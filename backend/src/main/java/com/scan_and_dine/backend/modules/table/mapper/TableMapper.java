package com.scan_and_dine.backend.modules.table.mapper;

import com.scan_and_dine.backend.modules.table.dto.CreateTableRequestDto;
import com.scan_and_dine.backend.modules.table.dto.TableResponseDto;
import com.scan_and_dine.backend.modules.table.dto.UpdateTableRequestDto;
import com.scan_and_dine.backend.modules.table.entity.Table;
import org.mapstruct.*;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface TableMapper {

    TableResponseDto toResponseDto(Table table);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isOccupied", ignore = true)
    @Mapping(target = "qrCode", ignore = true)
    @Mapping(target = "currentCustomers", ignore = true)
    @Mapping(target = "currentOrder", ignore = true)
    @Mapping(target = "currentReservation", ignore = true)
    @Mapping(target = "sessionStartTime", ignore = true)
    @Mapping(target = "totalSessionAmount", ignore = true)
    @Mapping(target = "lastCleaned", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Table toEntity(CreateTableRequestDto requestDto);

    @AfterMapping
    default void setDefaults(@MappingTarget Table table, CreateTableRequestDto requestDto) {
        table.setStatus(Table.TableStatus.AVAILABLE);
        table.setIsOccupied(false);
        table.setQrCode(generateQRCode(table.getNumber()));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "qrCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateTableRequestDto requestDto, @MappingTarget Table table);

    @AfterMapping
    default void updateIsOccupied(@MappingTarget Table table, UpdateTableRequestDto requestDto) {
        if (requestDto.getStatus() != null) {
            table.setIsOccupied(requestDto.getStatus() == Table.TableStatus.OCCUPIED);
        }
    }

    private String generateQRCode(String tableNumber) {
        return "QR-TABLE-" + tableNumber + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
} 