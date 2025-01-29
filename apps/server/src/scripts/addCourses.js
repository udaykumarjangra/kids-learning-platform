import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: 'subjects',
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    isPayable: {
      type: Boolean,
      required: true,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    _isCompleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

const CourseModel = mongoose.model('course', courseSchema)

const addCourse = async () => {
  const mongouri = ''
  await mongoose.connect(mongouri)
  try {
    const name = 'Multiplication'
    const subjectId = new mongoose.Types.ObjectId('671d7e9140a4afd705de9f74')
    const isPayable = true
    const price = 10
    const description = 'Learn multiplication of numbers.'
    const level = 3
    const content = `# ✖️ Learning Multiplication!

### What is Multiplication?
Multiplication is like adding the same number over and over. Instead of adding each time, we can multiply! Let’s look at some examples.

---

## Example 1: Counting with Apples

**2 × 3 = 6**

Imagine you have **3 groups of 2 apples** 🍎🍎 🍎🍎 🍎🍎. Instead of adding **2 + 2 + 2**, we can just say **2 × 3**.

- **2 apples** in **3 groups** = **6 apples** 🍎🍎🍎🍎🍎🍎.

---

## Example 2: Jumping with Frogs 🐸

**3 × 2 = 6**

You see **3 frogs** 🐸🐸🐸, and each one makes **2 jumps**. Instead of counting each jump one by one, we can multiply.

- **3 frogs** making **2 jumps** each = **6 jumps** 🐸🐸🐸🐸🐸🐸.

---

## Example 3: Counting Flowers 🌼

**4 × 2 = 8**

You have **4 pots**, each with **2 flowers** 🌼🌼. Instead of counting each flower, we can multiply.

- **4 pots** with **2 flowers** each = **8 flowers** 🌼🌼🌼🌼🌼🌼🌼🌼.

---

## Multiplying with Ladybugs 🐞

**5 × 1 = 5**

Imagine you have **5 ladybugs**, each with **1 spot** on their back 🐞🐞🐞🐞🐞. How many spots in total?

- **5 ladybugs** with **1 spot each** = **5 spots** 🐞🐞🐞🐞🐞.

---

### Remember:
Multiplication helps us add the same number over and over without counting each one. It’s a faster way to make groups!

`
    const course = new CourseModel({
      name,
      subjectId,
      isPayable,
      price,
      description,
      content,
      level,
    })
    await course.save()
    console.log(course)
  } catch (err) {
    console.error(err)
  }
}

addCourse()
