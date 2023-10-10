import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservation.repository';
import { PAYMENT_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRespository: ReservationsRepository,
    @Inject(PAYMENT_SERVICE) private readonly payment: ClientProxy,
  ) {}
  async create(createReservationDto: CreateReservationDto, user: UserDto) {
    return this.payment
      .send('create-charge', {
        ...createReservationDto.charge,
        email: user.email,
      })
      .pipe(
        map((res) => {
          return this.reservationRespository.create({
            ...createReservationDto,
            timestamp: new Date(),
            userId: user._id,
            invoiceId: res.id,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationRespository.find({});
  }

  async findOne(id: string) {
    return this.reservationRespository.findOne({
      _id: id,
    });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRespository.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateReservationDto,
      },
    );
  }

  async remove(id: string) {
    return this.reservationRespository.findOneAndDelete({
      _id: id,
    });
  }
}
