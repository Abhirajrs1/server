import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    minPrice: {
        type: Number,
    },
    maxPrice: {
        type: Number,
    },
    jobLocation: {
        type: String,
    },
    yearsOfExperience: {
        type: Number,
    },
    employmentType: {
        type: String
    },
    delete: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: new Date
    },
    description: {
        type: String
    },
    jobPostedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    skills: {
        type: []
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            if (ret.jobPostedOn) {
                const date = new Date(ret.jobPostedOn);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                ret.jobPostedOn = `${day}/${month}/${year}`;
            }
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
});

export const Job = mongoose.model('Job', JobSchema);
 